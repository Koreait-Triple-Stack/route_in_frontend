import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/system";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteButtonModal from "./DeleteButtonModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteNotificationByNotificationId,
    getNotificationListByUserId,
} from "../../apis/notification/notificationService";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

function NotificationPage() {
    const { principal } = usePrincipalState();
    const [notifications, setNotifications] = useState([]);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // 알림 조회
    const {
        data: response,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["getNotificationListByUserId", principal?.userId],
        queryFn: () => getNotificationListByUserId(principal.userId),
        staleTime: 30000,
        enabled: !!principal?.userId,
    });

    useEffect(() => {
        if (!isLoading) {
            setNotifications(response.data);
            queryClient.invalidateQueries(["countUnreadNotificationByUserId"]);
        }
    }, [isLoading, response]);

    // 알림 삭제
    const mutation = useMutation({
        mutationFn: (notificationId) =>
            deleteNotificationByNotificationId(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getNotificationListByUserId", principal.userId],
            });
        },
        onError: (error) => {
            alert(error);
        },
    });

    const onDeleteOne = (notificationId) => {
        mutation.mutate(notificationId);
    };

    const onClickNotification = (path) => {
        if (path) navigate(path)
    }

    if (isLoading) return <Loading />;
    if (error) return <Box>{error.message}</Box>;

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default",
                position: "relative",
            }}>
            {/* 헤더 */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, letterSpacing: -0.3 }}>
                    알림
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5 }}>
                    최근 활동을 확인하세요
                </Typography>
            </Box>

            {/* 스크롤 영역 */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: 2,
                    py: 1.5,
                }}>
                <Stack spacing={1.2}>
                    {notifications?.length ? (
                        notifications.map((n) => (
                            <Paper
                                key={n.notificationId}
                                elevation={0}
                                onClick={() => onClickNotification(n.path)}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    bgcolor: "background.paper",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    cursor: "pointer",
                                }}>
                                {/* 텍스트 */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.secondary",
                                            lineHeight: 1.35,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}>
                                        {n.message}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.disabled",
                                            display: "block",
                                            mt: 0.6,
                                        }}>
                                        {n.timeText}
                                    </Typography>
                                </Box>

                                {/* 삭제 버튼 */}
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteOne(n.notificationId);
                                    
                                    }
                                    }
                                    sx={{
                                        borderRadius: 2,
                                        borderColor: "divider",
                                        bgcolor: "grey.50",
                                    }}>
                                    <CloseRoundedIcon fontSize="small" />
                                </IconButton>
                            </Paper>
                        ))
                    ) : (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                border: "1px dashed",
                                borderColor: "divider",
                                bgcolor: "background.paper",
                                textAlign: "center",
                            }}>
                            <Typography sx={{ fontWeight: 800 }}>
                                알림이 없어요
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary", mt: 0.5 }}>
                                새로운 활동이 생기면 여기에 표시됩니다.
                            </Typography>
                        </Paper>
                    )}
                </Stack>
            </Box>

            {/* 전체 삭제 fixed */}
            <DeleteButtonModal />
        </Box>
    );
}

export default NotificationPage;
