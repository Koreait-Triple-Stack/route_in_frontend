import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

export function useNotificationWS({ enabled, token, onMessage, roomId }) {
    const clientRef = useRef(null);
    const onMessageRef = useRef(onMessage);
    const roomIdRef = useRef(roomId);
    const roomSubRef = useRef(null);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        roomIdRef.current = roomId;
    }, [roomId]);

    const subscribeRoom = (client, rid) => {
        // 기존 room 구독 제거
        roomSubRef.current?.unsubscribe?.();
        roomSubRef.current = null;

        if (!rid) return;

        roomSubRef.current = client.subscribe(`/topic/room/${rid}`, (msg) => {
            try {
                const payload = JSON.parse(msg.body);
                onMessageRef.current?.(payload);
            } catch (e) {}
        });
    };

    // ✅ 연결은 1번만
    useEffect(() => {
        if (!enabled || !token) return;

        // 이미 활성화 중이면 재생성 금지
        if (clientRef.current?.active) return;

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 3000,

            onConnect: () => {
                // 개인 알림
                client.subscribe("/user/queue/notification", (msg) => {
                    try {
                        const payload = JSON.parse(msg.body);
                        onMessageRef.current?.(payload);
                    } catch (e) {}
                });

                // ✅ 연결되는 순간 현재 roomId로 room 구독을 “무조건” 건다
                subscribeRoom(client, roomIdRef.current);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            roomSubRef.current?.unsubscribe?.();
            roomSubRef.current = null;

            client.deactivate();
            clientRef.current = null;
        };
    }, [enabled, token]);

    // ✅ roomId가 바뀌었고, 이미 연결되어 있으면 room 구독만 교체
    useEffect(() => {
        const client = clientRef.current;
        if (!client || !client.connected) return;

        subscribeRoom(client, roomId);
    }, [roomId]);
}
