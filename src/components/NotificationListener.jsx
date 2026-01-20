import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../store/usePrincipalState";
import { useNotificationStore } from "../store/useNotificationStore";
import { useNotificationWS } from "../hooks/useNotificationWS";
import { Alert, Button, Snackbar } from "@mui/material";

function NotificationListener() {
    const navigate = useNavigate();
    const token = localStorage.getItem("AccessToken");
    const { principal } = usePrincipalState();
    const { push } = useNotificationStore();
    const [open, setOpen] = useState(false);
    const [lastId, setLastId] = useState(null);
    const [toastMsg, setToastMsg] = useState("새 알림이 도착했어요");

    const close = (_, reason) => {
        if (reason === "clickway") return;
        setOpen(false);
    };

    const onMessage = useCallback(
        (payload) => {
            const id = payload?.notificationId ?? crypto.randomUUID();
            const message = payload?.message ?? payload?.body ?? "새 알림";
            const path = payload?.path ?? "/notification";

            const item = {
                id,
                message,
                path,
                createDt: payload?.createDt ?? new Date().toISOString(),
            };

            push(item);
            setLastId(id);
            setToastMsg(message);
            setOpen(true);
        },
        [push],
    );

    useNotificationWS({
        enabled: !!token && !!principal?.userId,
        token,
        onMessage,
    })

    const goNotifications = () => {
        navigate("/notification", { state: { focusId: lastId}})
        setOpen(false)
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={3500}
            onClose={close}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <Alert
                severity="info"
                variant="filled"
                onClose={close}
                sx={{
                    borderRadius: 2.5,
                    alignItems: "center",
                    "& .MuiAlert-message": { width: "100%" },
                }}
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={goNotifications}>
                        보기
                    </Button>
                }>
                {toastMsg}
            </Alert>
        </Snackbar>
    );
}

export default NotificationListener;
