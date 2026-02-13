import {
    Avatar,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quitRoomRequest } from "../../apis/chat/chatApi";
import { useToastStore } from "../../store/useToastStore";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useState } from "react";
import DialogComponent from "../../components/DialogComponent";

function MenuDrawer({ participants, setIsMenu, isMenu, setIsInvite }) {
    const navigate = useNavigate();
    const { show } = useToastStore();
    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();
    const [openLeaveRoom, setOpenLeaveRoom] = useState(false);
    const { roomId: roomIdParam } = useParams();
    const roomId = Number(roomIdParam);
    const leaveRoomMutation = useMutation({
        mutationFn: quitRoomRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
            queryClient.invalidateQueries({
                queryKey: ["getRoomListByUserIdRequest", principal.userId],
            });
            navigate("/chat");
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const handleLeaveRoom = () => {
        leaveRoomMutation.mutate({
            roomId: roomId,
            userId: principal.userId,
            username: principal.username,
        });
        setOpenLeaveRoom(false);
    };

    return (
        <>
            {isMenu && (
                <Box
                    onClick={() => setIsMenu(false)}
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 1200,
                    }}
                />
            )}

            <Drawer
                anchor="right"
                open={isMenu}
                onClose={() => setIsMenu(false)}
                variant="temporary"
                sx={{
                    "& .MuiDrawer-root": {
                        position: "absolute",
                        zIndex: 1300,
                        height: "100%",
                    },
                    "& .MuiDrawer-paper": {
                        position: "absolute",
                        width: "80%",
                        boxSizing: "border-box",
                        borderLeft: "1px solid #ddd",
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                    },
                }}>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#fff",
                    }}>
                    <Box
                        sx={{
                            p: 1.5,
                            pl: 2,
                            flexShrink: 0,
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                        }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setIsMenu(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider />

                    <Box sx={{ flex: 1, overflowY: "auto" }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            px={2}
                            pt={2}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}>
                                대화상대 {participants.length}
                            </Typography>
                            <Button
                                size="medium"
                                sx={{ color: "#555" }}
                                onClick={() => setIsInvite(true)}>
                                초대
                            </Button>
                        </Stack>

                        <List>
                            {participants.map((user) => (
                                <ListItem sx={{ px: 1 }} key={user.userId}>
                                    <ListItemButton
                                        onClick={() =>
                                            navigate(`/user/${user.userId}`)
                                        }
                                        disableGutters
                                        sx={{ pl: 1, borderRadius: 3 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                src={user.profileImg}
                                                size={48}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.username}
                                            primaryTypographyProps={{
                                                fontWeight: "550",
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>

                <Divider />

                <Box
                    sx={{
                        flexShrink: 0,
                        py: 1,
                        px: 2,
                        display: "flex",
                        justifyContent: "end",
                    }}>
                    <Button
                        onClick={() => setOpenLeaveRoom(true)}
                        sx={{
                            color: "error.main",
                            "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
                        }}>
                        <LogoutOutlinedIcon />
                        채팅방 나가기
                    </Button>
                </Box>
            </Drawer>

            <DialogComponent
                open={openLeaveRoom}
                setOpen={setOpenLeaveRoom}
                title="채팅방 나가기"
                content={"채팅방을 나가시겠습니까?"}
                onClick={handleLeaveRoom}
                color="error"
                ment="나가기"
            />
        </>
    );
}

export default MenuDrawer;
