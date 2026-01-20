import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

export function useNotificationWS({ enabled, token, onMessage }) {
    const clientRef = useRef(null);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!enabled || !token) return;

        if (clientRef.current?.activate) return;

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: () => {},

            reconnectDelay: 3000,
            onConnect: () => {
                client.subscribe("/user/queue/notification", (msg) => {
                    try {
                        const payload = JSON.parse(msg.body);
                        onMessageRef.current?.(payload);
                    } catch (e) {
                        console.error("Invalid WS message:", e);
                    }
                });
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [enabled, token]);
}
