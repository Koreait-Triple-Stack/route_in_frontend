import {
    Avatar,
    Badge,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../apis/utils/time";
import MenuModal from "./MenuModal";

function RoomList({ roomList }) {
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleChatClick = (id) => {
        navigate(`/chat/room/${id}`);
    };

    // ✅ [핵심] 꾹 누르기(모바일) or 우클릭(PC) 핸들러
    const handleContextMenu = (event, room) => {
        event.preventDefault(); // 브라우저 기본 메뉴(복사/인쇄 등)가 안 뜨게 막음!
        setSelectedRoom(room); // 어떤 채팅방을 눌렀는지 저장
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                  }
                : null,
        );
    };

    return (
        <Box sx={{ px: 0, flex: 1, overflowY: "auto" }}>
            <List
                sx={{
                    px: 0,
                    width: "100%",
                    bgcolor: "background.paper",
                    overflowY: "auto",
                }}>
                {roomList &&
                    roomList?.map((room) => (
                        <ListItemButton
                            display="flex"
                            key={room.roomId}
                            alignItems="center"
                            onClick={() => handleChatClick(room.roomId)}
                            onContextMenu={(e) =>
                                handleContextMenu(e, room)
                            }
                            sx={{ py: 1.5, px: 1, borderRadius: 4 }}>
                            <ListItemAvatar sx={{ minWidth: 0, margin: 0 }}>
                                <Avatar
                                    src={room.profileImg}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                    }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            color: "#000",
                                        }}>
                                        {room.title}
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: "block",
                                            color: "#777",
                                            fontSize: "0.9rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "220px",
                                        }}>
                                        {room.lastMessage}
                                    </Typography>
                                }
                                sx={{ my: 0, px: 1 }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    ml: 1,
                                    mb: 2.5,
                                    minWidth: "60px",
                                }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#999",
                                        fontSize: "0.75rem",
                                        mb: 0.5,
                                    }}>
                                    {timeAgo(room.lastMessageDt)}
                                </Typography>
                                {room.unreadCnt > 0 && (
                                    <Badge
                                        badgeContent={room.unreadCnt}
                                        color="error"
                                        sx={{
                                            "& .MuiBadge-badge": {
                                                fontSize: "0.7rem",
                                                height: 18,
                                                minWidth: 18,
                                                mt: 1,
                                                bgcolor: "#fa5a5a",
                                            },
                                        }}
                                    />
                                )}
                            </Box>
                        </ListItemButton>
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

export default RoomList;
