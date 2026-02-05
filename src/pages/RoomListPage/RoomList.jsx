import {
    Avatar,
    List,
    ListItemButton,
    Typography,
    Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../apis/utils/time";
import MenuModal from "./MenuModal";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";

function RoomList({ roomList }) {
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleChatClick = (id) => navigate(`/chat/room/${id}`);

    const handleContextMenu = (event, room) => {
        event.preventDefault();
        setSelectedRoom(room);
        setContextMenu(
            contextMenu === null
                ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 }
                : null,
        );
    };

    return (
        <Box sx={{ px: 0 }}>
            <List sx={{ px: 1, pt: 1 }}>
                {roomList?.map((room) => (
                    <Paper
                        key={room.roomId}
                        elevation={0}
                        sx={{
                            mb: 1.2,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            overflow: "hidden",
                            bgcolor: "background.paper",
                        }}>
                        <ListItemButton
                            onClick={() => handleChatClick(room.roomId)}
                            onContextMenu={(e) => handleContextMenu(e, room)}
                            sx={{
                                p: 1.5,
                                gap: 1.5,
                                alignItems: "flex-start",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                                transition: "0.15s",
                            }}>
                            <Avatar
                                src={room.profileImg}
                                sx={{ width: 52, height: 52, mt: 0.2 }}
                            />

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <StackTitle
                                    title={room.title}
                                    favorite={room.favorite}
                                    mute={room.muteNotification}
                                />

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 0.4,
                                        color: "text.secondary",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}>
                                    {room.lastMessage || " "}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    height: 44,
                                }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: "text.disabled" }}>
                                    {timeAgo(room.lastMessageDt)}
                                </Typography>

                                {room.unreadCnt > 0 && (
                                    <Box
                                        sx={{
                                            bgcolor: "error.main",
                                            color: "#fff",
                                            fontSize: "0.72rem",
                                            minWidth: 18,
                                            height: 18,
                                            px: 0.6,
                                            borderRadius: 999,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 600,
                                            lineHeight: 1,
                                        }}>
                                        {room.unreadCnt}
                                    </Box>
                                )}
                            </Box>
                        </ListItemButton>
                    </Paper>
                ))}
            </List>

            <MenuModal
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
            />
        </Box>
    );
}

function StackTitle({ title, favorite, mute }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                minWidth: 0,
            }}>
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 900,
                    letterSpacing: -0.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                }}>
                {title}
            </Typography>

            {favorite && (
                <StarRoundedIcon
                    fontSize="small"
                    sx={{ color: "warning.light" }}
                />
            )}
            {mute && (
                <NotificationsOffRoundedIcon
                    fontSize="small"
                    sx={{ color: "text.disabled" }}
                />
            )}
        </Box>
    );
}

export default RoomList;
