import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../store/usePrincipalState";
import { useNotificationStore } from "../store/useNotificationStore";
import { useNotificationWS } from "../hooks/useNotificationWS";
import { Alert, Avatar, Button, Snackbar, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Box } from "@mui/system";
import { useChatUiState } from "../store/useChatUiState";

function NotificationListener() {
    const navigate = useNavigate();
    const token = localStorage.getItem("AccessToken");
    const queryClient = useQueryClient();
    const { principal } = usePrincipalState();
    // const { push } = useNotificationStore();
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

    const onMessage = useCallback(
        (payload) => {
            const payloadType = payload?.type;
            const payloadRoomId = payload?.roomId ?? payload?.data?.roomId;

            if (payloadType === "CHAT_MESSAGE") {
                // 1) 채팅목록 갱신(방 밖에서도)
                queryClient.invalidateQueries({
                    queryKey: ["getRoomListByUserIdRequest", principal.userId],
                });

                // 2) 내가 그 방 보고 있으면 메시지 리스트도 갱신
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

                    // ✅ 방 안이면 토스트는 안 띄우고 종료
                    return;
                }
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
                }
                return;
            }

            // ✅ 2) read가 아닌 이벤트만: "현재 보고 있는 방"이면 스낵바만 suppress
            if (
                payloadRoomId != null &&
                activeRoomId != null &&
                Number(payloadRoomId) === Number(activeRoomId)
            ) {
                return;
            }

            // --- 여기서부터는 스낵바 띄우는 일반 알림 처리 ---
            const id = payload?.notificationId ?? crypto.randomUUID();
            const title = payload?.title ?? "새 알림";
            const message = payload?.message ?? "새 알림";
            const path = payload?.path ?? "/notification";
            const profileImg = payload?.profileImg ?? ""; // ✅ 오타 수정: profilImg -> profileImg

            setLastId(id);
            setTitle(title);
            setToastMsg(message);
            setPath(path);
            setProfileImg(profileImg);
            setOpen(true);

            queryClient.invalidateQueries({
                queryKey: ["countUnreadNotificationByUserId"],
            });
        },
        [activeRoomId, principal?.userId, queryClient],
    );

    useNotificationWS({
        enabled: !!token && !!principal?.userId,
        token,
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
                    {/* 프로필 이미지 */}
                    <Avatar src={profileImg} sx={{ width: 30, height: 30 }}>
                        {!!profileImg && ""}
                    </Avatar>

                    {/* 제목 + 내용 */}
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
