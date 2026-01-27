import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../store/usePrincipalState";
import { useNotificationStore } from "../store/useNotificationStore";
import { useNotificationWS } from "../hooks/useNotificationWS";
import { Alert, Avatar, Button, Snackbar, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Box } from "@mui/system";

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

    const onMessage = useCallback(
        (payload) => {
            const id = payload?.notificationId ?? crypto.randomUUID();
            const title = payload?.title ?? "새 알림";
            const message = payload?.message ?? "새 알림";
            const path = payload?.path ?? "/notification";
            const profileImg = payload?.profilImg ?? "";

            setLastId(id);
            setTitle(title)
            setToastMsg(message);
            setPath(path);
            setProfileImg(profileImg)
            setOpen(true);

            queryClient.invalidateQueries(["countUnreadNotificationByUserId"]);
        },
        [],
    );

    useNotificationWS({
        enabled: !!token && !!principal?.userId,
        token,
        onMessage,
    })

    const goNotifications = () => {
        navigate(path, { state: { focusId: lastId}})
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
                icon={false}
                variant="filled"
                onClose={close}
                sx={{
                    borderRadius: 2.5,
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
