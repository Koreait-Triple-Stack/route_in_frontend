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
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemButton,
} from "@mui/material";

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
        if (path) navigate(path);
    };

    if (isLoading) return <Loading />;
    if (error) return <Box>{error.message}</Box>;

    return (
        <Container>
            {/* 헤더 */}
            <Box
                sx={{
                    px: 1.5,
                    pb: 1.5,
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
            <List>
                {notifications?.length ? (
                    notifications.map((n) => (
                        <Box key={n.notificationId}>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemButton
                                    onClick={() => onClickNotification(n.path)}
                                    sx={{ borderRadius: 3, pl: 1 }}>
                                    <Avatar
                                        src={n?.profileImg}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                        }}></Avatar>
                                    {/* 텍스트 */}
                                    <Box
                                        sx={{
                                            pl: 2,
                                            flex: 1,
                                            minWidth: 0,
                                        }}>
                                        {n.title && (
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 800,
                                                    lineHeight: 1.2,
                                                    mb: 0.3,
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
                                                color: "text.secondary",
                                                lineHeight: 1.35,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}>
                                            {n.message}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "text.disabled",
                                                display: "block",
                                            }}>
                                            {timeAgo(n.createDt)}
                                        </Typography>
                                    </Box>

                                    {/* 삭제 버튼 */}
                                    <IconButton
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteOne(n.notificationId);
                                        }}>
                                        <CloseRoundedIcon fontSize="small" />
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>

                            <Divider variant="middle" />
                        </Box>
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
            </List>

            {/* 전체 삭제 fixed */}
            <DeleteButtonModal />
        </Container>
    );
}

export default NotificationPage;
