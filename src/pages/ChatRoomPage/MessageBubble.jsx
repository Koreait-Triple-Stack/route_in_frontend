import { Box, Container } from "@mui/system";
import React from "react";
import UserAvatarLink from "../../components/UserAvatarLink";
import { Typography } from "@mui/material";

// 🟡 1. 메시지 버블 컴포넌트
const MessageBubbleComponent = ({ message }) => {
    const { id, text, time, isMe, sender, profile } = message;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row", // 내꺼면 오른쪽, 남이면 왼쪽
                alignItems: "flex-start",
                mb: 2,
            }}
        >
            {/* 상대방일 경우 프로필 사진 표시 */}
            {!isMe && <UserAvatarLink userId={id} src={profile} size={48} />}

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", ml: 1 }}>
                {/* 상대방 이름 */}
                {!isMe && (
                    <Typography variant="caption" sx={{ color: "#555", mb: 0.5, ml: 0.5 }}>
                        {sender}
                    </Typography>
                )}

                {/* 말풍선과 시간 배치 */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isMe ? "row-reverse" : "row", // 시간 위치 조정을 위해
                        alignItems: "flex-end", // 말풍선 하단에 시간 정렬
                    }}
                >
                    {/* 💬 말풍선 */}
                    <Box
                        sx={{
                            bgcolor: isMe ? "#FEE500" : "#FFFFFF", // 카카오 노랑 vs 흰색
                            color: "#000",
                            p: "10px 14px",
                            borderRadius: isMe ? "15px 0px 15px 15px" : "0px 15px 15px 15px", // 꼬리 모양 흉내
                            maxWidth: "70vw", // 화면의 70%까지만 차지
                            maxHeight: "40px",
                            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                            wordBreak: "break-word",
                            fontSize: "0.95rem",
                            lineHeight: 1.5,
                        }}
                    >
                        {text}
                    </Box>

                    {/* 🕒 시간 표시 */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#555",
                            fontSize: "0.7rem",
                            mx: 0.5,
                            minWidth: "max-content", // 줄바꿈 방지
                        }}
                    >
                        {time}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

function MessageBubble({scrollRef, messages}) {
    return (
        <Container sx={{height: "100%"}}>
            {/* 📜 채팅 리스트 영역 */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* 날짜 구분선 예시 */}
                <Box sx={{ textAlign: "center", mb: 3, mt: 1 }}>
                    <Typography
                        sx={{
                            display: "inline-block",
                            bgcolor: "rgba(0,0,0,0.1)",
                            color: "#fff",
                            px: 2,
                            py: 0.5,
                            borderRadius: 10,
                            fontSize: "0.75rem",
                        }}
                    >
                        2026년 1월 26일 월요일
                    </Typography>
                </Box>
                {messages.map((msg) => (
                    <MessageBubbleComponent key={msg.id} message={msg} />
                ))}
                <div ref={scrollRef} /> {/* 스크롤 하단 고정용 */}
            </Box>
        </Container>
    );
}

export default MessageBubble;
