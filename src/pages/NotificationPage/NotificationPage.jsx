import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/system";
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
import { timeAgo } from "../../apis/utils/time";
import { Avatar, List, ListItemButton } from "@mui/material";

function NotificationPage() {
    const { principal } = usePrincipalState();
    const [notifications, setNotifications] = useState([]);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
            setNotifications(response?.data ?? []);
            queryClient.invalidateQueries(["countUnreadNotificationByUserId"]);
        }
    }, [isLoading, response, queryClient]);

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

    const onDeleteOne = (notificationId) => mutation.mutate(notificationId);

    const onClickNotification = (path) => {
        if (path) navigate(path);
    };

    if (isLoading) return <Loading />;
    if (error) return <Box>{error.message}</Box>;

    return (
        <Container>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    px: 1.5,
                    pt: 2,
                    pb: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    backdropFilter: "blur(6px)",
                }}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
                    알림
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5 }}>
                    최근 활동을 확인하세요
                </Typography>
            </Box>

            <List sx={{ px: 1, pt: 1.5 }}>
                {notifications?.length ? (
                    notifications.map((n) => (
                        <Box key={n.notificationId} sx={{ mb: 1.2 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    overflow: "hidden",
                                    bgcolor: "background.paper",
                                }}>
                                <ListItemButton
                                    onClick={() => onClickNotification(n.path)}
                                    sx={{
                                        alignItems: "flex-start",
                                        gap: 1.5,
                                        p: 1.5,
                                        borderRadius: 0,
                                        "&:hover .deleteBtn": {
                                            opacity: 1,
                                        },
                                        "&:hover": {
                                            bgcolor: "action.hover",
                                        },
                                    }}>
                                    <Avatar
                                        src={n?.profileImg}
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            mt: 0.2,
                                        }}
                                    />

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        {n.title && (
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 800,
                                                    lineHeight: 1.25,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>
                                                {n.title}
                                            </Typography>
                                        )}

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 0.3,
                                                color: "text.secondary",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}>
                                            {n.message}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 0.3,
                                                color: "text.disabled",
                                                display: "block",
                                            }}>
                                            {timeAgo(n.createDt)}
                                        </Typography>
                                    </Box>

                                    <IconButton
                                        className="deleteBtn"
                                        size="small"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteOne(n.notificationId);
                                        }}
                                        sx={{
                                            mt: 0.2,
                                            opacity: 0.35,
                                            transition: "0.15s",
                                            "&:hover": { opacity: 1 },
                                        }}>
                                        <CloseRoundedIcon fontSize="small" />
                                    </IconButton>
                                </ListItemButton>
                            </Paper>
                        </Box>
                    ))
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 2,
                            p: 4,
                            borderRadius: 3,
                            border: "1px dashed",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            textAlign: "center",
                        }}>
                        <Typography sx={{ fontWeight: 900 }}>
                            알림이 없어요
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", mt: 0.7 }}>
                            새로운 활동이 생기면 여기에 표시됩니다.
                        </Typography>
                    </Paper>
                )}
            </List>

            <DeleteButtonModal />
        </Container>
    );
}

export default NotificationPage;
