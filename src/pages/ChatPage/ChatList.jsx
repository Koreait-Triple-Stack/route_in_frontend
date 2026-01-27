import { Avatar, Badge, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function ChatList({contextMenu, setContextMenu, setSelectedChatId}) {
    const navigate = useNavigate();

    const handleChatClick = (id) => {
        navigate(`/chat/room`);
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
        <Container>
            {/* 채팅 리스트 */}
            <List sx={{ width: "100%", bgcolor: "background.paper", flex: 1, overflowY: "auto" }}>
                {CHAT_ROOMS.map((chat) => (
                    <ListItemButton
                        display="flex"
                        key={chat.id}
                        alignItems="center"
                        onClick={() => handleChatClick(chat.id)}
                        // ✅ 여기에 우클릭/꾹누르기 이벤트 연결
                        onContextMenu={(e) => handleContextMenu(e, chat.id)}
                        sx={{ pl: 0, py: 1.5 }}
                    >
                        <ListItemAvatar sx={{ minWidth: 0, margin: 0 }}>
                            <Avatar alt={chat.name} src={chat.avatar} sx={{ width: 50, height: 50, border: "1px solid #f0f0f0" }} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1rem", color: "#000" }}>
                                    {chat.name}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    variant="body2"
                                    sx={{ display: "block", color: "#777", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "220px" }}
                                >
                                    {chat.lastMessage}
                                </Typography>
                            }
                            sx={{ my: 0, px: 1 }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", ml: 1, mb: 2.5, minWidth: "60px" }}>
                            <Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem", mb: 0.5, ml: 3 }}>
                                {chat.time}
                            </Typography>
                            {chat.unread > 0 && (
                                <Badge badgeContent={chat.unread} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "0.7rem", height: 18, minWidth: 18, margin: 1, bgcolor: "#fa5a5a" } }} />
                            )}
                        </Box>
                    </ListItemButton>
                ))}
            </List>
        </Container>
    );
}

export default ChatList;
