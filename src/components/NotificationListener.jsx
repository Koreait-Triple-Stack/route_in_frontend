import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../store/usePrincipalState";
import { useNotificationWS } from "../hooks/useNotificationWS";
import { Alert, Avatar, Button, Snackbar, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Box } from "@mui/system";
import { useChatUiState } from "../store/useChatUiState";

function NotificationListener() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { principal, token } = usePrincipalState();
    const [open, setOpen] = useState(false);
    const [lastId, setLastId] = useState(null);
    const [toastMsg, setToastMsg] = useState("새 알림이 도착했어요");
    const [title, setTitle] = useState("새 알림");
    const [profileImg, setProfileImg] = useState("");
    const [path, setPath] = useState("");

    const close = (_, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };
    const activeRoomId = useChatUiState((s) => s.activeRoomId);

    const uid = principal?.userId ?? null;

    const onMessage = useCallback(
        (payload) => {
            try {
            if (!uid) return;

            const payloadType = payload?.type;
            const payloadRoomId = payload?.roomId ?? payload?.data?.roomId;

            if (payloadType === "CHAT_MESSAGE" || payloadType === "CHAT_MUTE") {
                queryClient.invalidateQueries({
                    queryKey: ["getRoomListByUserIdRequest", uid],
                });
            }

            if (payloadType === "CHAT_MESSAGE") {
                if (
                    payloadRoomId != null &&
                    activeRoomId != null &&
                    Number(payloadRoomId) === Number(activeRoomId)
                ) {
                    queryClient.invalidateQueries({
                        queryKey: [
                            "getMessageListInfiniteRequest",
                            { roomId: Number(payloadRoomId), limit: 20 },
                        ],
                    });
                    return;
                }
            }

            if (payloadType === "CHAT_MUTE") {
                queryClient.invalidateQueries({
                    queryKey: ["countUnreadChatByUserIdRequest", uid],
                });

                if (
                    payloadRoomId != null &&
                    activeRoomId != null &&
                    Number(payloadRoomId) === Number(activeRoomId)
                ) {
                    queryClient.invalidateQueries({
                        queryKey: [
                            "getMessageListInfiniteRequest",
                            { roomId: Number(payloadRoomId), limit: 20 },
                        ],
                    });
                }
                return;
            }

            if (payloadType === "MESSAGE") {
                if (payloadRoomId != null) {
                    queryClient.invalidateQueries({
                        queryKey: ["getRoomByRoomIdRequest", payloadRoomId],
                    });
                }
                return;
            }

            if (payloadType === "read") {
                if (
                    payloadRoomId != null &&
                    activeRoomId != null &&
                    Number(payloadRoomId) === Number(activeRoomId)
                ) {
                    queryClient.invalidateQueries({
                        queryKey: [
                            "getMessageListInfiniteRequest",
                            { roomId: activeRoomId, limit: 20 },
                        ],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["countUnreadChatByUserIdRequest", uid],
                    });
                }
                return;
            }

            console.log("[SNACKBAR OPEN]", payload);

            const id = payload?.notificationId ?? crypto.randomUUID();
            const nextTitle = payload?.title ?? "새 알림";
            const message = payload?.message ?? "새 알림";
            const nextPath = payload?.path ?? "/notification";
            const nextProfileImg = payload?.profileImg ?? "";

            setLastId(id);
            setTitle(nextTitle);
            setToastMsg(message);
            setPath(nextPath);
            setProfileImg(nextProfileImg);

            setOpen(false);
            queueMicrotask(() => setOpen(true));

            queryClient.invalidateQueries({
                queryKey: ["countUnreadNotificationByUserId", uid],
            });
            queryClient.invalidateQueries({
                queryKey: ["countUnreadChatByUserIdRequest", uid],
            });

            } catch (e) {
                console.error("[onMessage crash]", e, payload);
            }
        },
        [uid, activeRoomId, queryClient],
    );


    useNotificationWS({
        enabled: !!token && !!principal?.userId,
        token,
        userId: principal?.userId,
        onMessage,
        roomId: activeRoomId,
    });

    const goNotifications = () => {
        navigate(path, { state: { focusId: lastId } });
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3500}
            onClose={close}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{
                pointerEvents: "none",
                zIndex: 99999,
            }}>
            <Alert
                severity="info"
                icon={false}
                variant="filled"
                onClose={close}
                sx={{
                    pointerEvents: "auto",
                    borderRadius: 2.5,
                    maxWidth: 320,
                    zIndex: 99999,
                    "& .MuiAlert-message": {
                        width: "100%",
                        p: 0,
                    },
                }}
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={goNotifications}>
                        보기
                    </Button>
                }>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}>
                    <Avatar src={profileImg} sx={{ width: 30, height: 30 }}>
                        {!!profileImg && ""}
                    </Avatar>

                    <Box>
                        <Typography fontSize={14} fontWeight={600}>
                            {title || "새 알림"}
                        </Typography>

                        <Typography
                            fontSize={13}
                            sx={{
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                wordBreak: "break-word",
                                maxWidth: 220,
                            }}>
                            {toastMsg}
                        </Typography>
                    </Box>
                </Box>
            </Alert>
        </Snackbar>
    );
}

export default NotificationListener;
