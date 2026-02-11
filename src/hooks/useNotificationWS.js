import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

export function useNotificationWS({
    enabled,
    token,
    userId,
    onMessage,
    roomId,
}) {
    const clientRef = useRef(null);
    const onMessageRef = useRef(onMessage);

    const notifSubRef = useRef(null);
    const roomSubRef = useRef(null);

    const [isConnected, setIsConnected] = useState(false);
    const lastPresenceRoomIdRef = useRef(undefined);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const safeUnsubscribe = (subRef) => {
        const client = clientRef.current;
        if (client?.connected) {
            try {
                subRef.current?.unsubscribe?.();
            } catch (e) {}
        }
        subRef.current = null;
    };

    const unsubscribeRoom = () => safeUnsubscribe(roomSubRef);
    const unsubscribeNotif = () => safeUnsubscribe(notifSubRef);

    const subscribeRoom = (client, rid) => {
        unsubscribeRoom();
        if (!rid) return;

        roomSubRef.current = client.subscribe(`/topic/room/${rid}`, (msg) => {
            try {
                onMessageRef.current?.(JSON.parse(msg.body));
            } catch (e) {}
        });
    };

    const subscribeNotif = (client, uid) => {
        unsubscribeNotif();
        if (!uid) return;

        notifSubRef.current = client.subscribe(
            `/topic/notification/${uid}`,
            (msg) => {
                try {
                    onMessageRef.current?.(JSON.parse(msg.body));
                } catch (e) {}
            },
        );
    };

    const sendPresence = (client, rid) => {
        if (!client?.connected) return;

        const normalized = rid == null ? null : Number(rid);
        if (lastPresenceRoomIdRef.current === normalized) return;
        lastPresenceRoomIdRef.current = normalized;

        try {
            client.publish({
                destination: "/app/presence/active",
                body: JSON.stringify({ roomId: normalized }),
            });
        } catch (e) {}
    };

    useEffect(() => {
        if (!enabled || !token || !userId) {
            setIsConnected(false);
            lastPresenceRoomIdRef.current = undefined;

            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }

            notifSubRef.current = null;
            roomSubRef.current = null;
            return;
        }

        if (clientRef.current?.active) return;

        const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
        const wsUrl = `${wsScheme}://${window.location.host}/ws`;

        const client = new Client({
            brokerURL: wsUrl,
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 3000,

            onConnect: () => {
                setIsConnected(true);

                subscribeNotif(client, userId);

                sendPresence(client, roomId);
                subscribeRoom(client, roomId);
            },

            onDisconnect: () => {
                setIsConnected(false);
                notifSubRef.current = null;
                roomSubRef.current = null;
            },

            onStompError: (frame) => {
                console.error("[WS] stomp error", frame?.headers, frame?.body);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            setIsConnected(false);

            const c = clientRef.current;
            clientRef.current = null;

            try {
                c?.deactivate();
            } catch (e) {}

            notifSubRef.current = null;
            roomSubRef.current = null;
            lastPresenceRoomIdRef.current = undefined;
        };
    }, [enabled, token, userId]);

    useEffect(() => {
        const client = clientRef.current;
        if (!client || !isConnected) return;

        subscribeNotif(client, userId);

        subscribeRoom(client, roomId);
        sendPresence(client, roomId);
    }, [roomId, isConnected, userId]);
}
