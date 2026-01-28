import {
    Avatar,
    Badge,
    Divider,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../apis/utils/time";

// ✅ 더미 데이터 (채팅방 목록)
const CHAT_ROOMS = [
    {
        id: 22,
        name: "김개발",
        lastMessage: "넵 알겠습니다 ㅎㅎ 이따 봬요!",
        time: "오후 2:35",
        unread: 2,
        avatar: "",
    },
    {
        id: 2,
        name: "러닝 크루 3기",
        lastMessage: "오늘 우천으로 인해 정기 러닝은 취소되었습니다 ㅠㅠ",
        time: "오전 11:20",
        unread: 15,
        avatar: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=100", // 예시 이미지
    },
    {
        id: 3,
        name: "알림톡",
        lastMessage: "회원가입을 환영합니다! 쿠폰이 도착했어요.",
        time: "어제",
        unread: 0,
        avatar: null, // 없을 경우 기본 아이콘
    },
    {
        id: 4,
        name: "엄마",
        lastMessage: "저녁 먹고 들어오니?",
        time: "어제",
        unread: 0,
        avatar: "",
    },
];

function RoomList({ roomList }) {
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);

    const handleLeaveChat = () => {
        if (window.confirm("정말 이 채팅방을 나가시겠습니까?")) {
            console.log(selectedChatId, "번 방 나가기 처리");
            // 여기에 나가기 API 호출 로직 추가
        }
        handleClose();
    };
    // 메뉴 닫기
    const handleClose = () => {
        setContextMenu(null);
        setSelectedChatId(null);
    };

    const handleChatClick = (id) => {
        navigate(`/chat/room/${id}`);
    };

    // ✅ [핵심] 꾹 누르기(모바일) or 우클릭(PC) 핸들러
    const handleContextMenu = (event, id) => {
        event.preventDefault(); // 브라우저 기본 메뉴(복사/인쇄 등)가 안 뜨게 막음!
        setSelectedChatId(id); // 어떤 채팅방을 눌렀는지 저장
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
        <Box sx={{ flex: 1, overflowY: "auto" }}>
            <List
                sx={{
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
                            // ✅ 여기에 우클릭/꾹누르기 이벤트 연결
                            onContextMenu={(e) =>
                                handleContextMenu(e, room.roomId)
                            }
                            sx={{ py: 1.5, px: 0.5 }}>
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
                                    alignItems: "flex-end",
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
                                        ml: 3,
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
                                                margin: 1,
                                                bgcolor: "#fa5a5a",
                                            },
                                        }}
                                    />
                                )}
                            </Box>
                        </ListItemButton>
                    ))}
            </List>

            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
                PaperProps={{
                    style: { width: 200 },
                }}>
                <MenuItem onClick={handleClose}>채팅방 이름 설정</MenuItem>
                <MenuItem onClick={handleClose}>즐겨찾기에 추가</MenuItem>
                <MenuItem onClick={handleClose}>채팅방 알림 끄기</MenuItem>
                <Divider />
                <MenuItem onClick={handleLeaveChat} sx={{ color: "#d32f2f" }}>
                    나가기
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default RoomList;
