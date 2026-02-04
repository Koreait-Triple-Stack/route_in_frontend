import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

export function useNotificationWS({ enabled, token, onMessage, roomId }) {
    const clientRef = useRef(null);
    const onMessageRef = useRef(onMessage);

    const notifSubRef = useRef(null);
    const roomSubRef = useRef(null);

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const unsubscribeRoom = () => {
        roomSubRef.current?.unsubscribe?.();
        roomSubRef.current = null;
    };
    const unsubscribeNotif = () => {
        notifSubRef.current?.unsubscribe?.();
        notifSubRef.current = null;
    };

    const subscribeRoom = (client, rid) => {
        unsubscribeRoom();
        if (!rid) return;

        roomSubRef.current = client.subscribe(`/topic/room/${rid}`, (msg) => {
            try {
                onMessageRef.current?.(JSON.parse(msg.body));
            } catch (e) {}
        });
    };

    useEffect(() => {
        if (!enabled || !token) {
            setIsConnected(false);
            if (clientRef.current) {
                unsubscribeRoom();
                unsubscribeNotif();
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        if (clientRef.current?.active) return;

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 3000,

            onConnect: () => {
                setIsConnected(true);

                unsubscribeNotif();
                notifSubRef.current = client.subscribe(
                    "/user/queue/notification",
                    (msg) => {
                        try {
                            onMessageRef.current?.(JSON.parse(msg.body));
                        } catch (e) {}
                    },
                );
            },

            onDisconnect: () => {
                console.log("[WS] disconnected");
                setIsConnected(false);
                unsubscribeRoom();
                unsubscribeNotif();
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            setIsConnected(false);
            unsubscribeRoom();
            unsubscribeNotif();
            client.deactivate();
            clientRef.current = null;
        };
    }, [enabled, token]);

    useEffect(() => {
        const client = clientRef.current;
        if (!client || !isConnected) return;
        subscribeRoom(client, roomId);
    }, [roomId, isConnected]);
}
