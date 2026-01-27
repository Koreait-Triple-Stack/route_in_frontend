import React from "react";
import UserAvatarLink from "../../components/UserAvatarLink";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { usePrincipalState } from "../../store/usePrincipalState";

function MessageBubbleComponent({ message }) {
    const { principal } = usePrincipalState();
    const {
        messageId,
        roomId,
        senderId,
        type,
        content,
        createDt,
        profileImg,
        username,
        unreadCnt,
    } = message;
    const isMe = message.senderId === principal?.userId;
    const event = new Date(createDt);
    const time = event.toLocaleString("ko-KR", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    return (
        <Box
            id="app-scroll"
            sx={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row", // 내꺼면 오른쪽, 남이면 왼쪽
                alignItems: "flex-start",
                mb: 2,
                width: "100%",
                height: "100%",
            }}>
            {/* 상대방일 경우 프로필 사진 표시 */}
            {!isMe && (
                <UserAvatarLink userId={senderId} src={profileImg} size={48} />
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                    ml: 1,
                }}>
                {/* 상대방 이름 */}
                {!isMe && (
                    <Typography
                        variant="caption"
                        sx={{ color: "#555", mb: 0.5, ml: 0.5 }}>
                        {username}
                    </Typography>
                )}

                {/* 말풍선과 시간 배치 */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isMe ? "row-reverse" : "row", // 시간 위치 조정을 위해
                        alignItems: "flex-end", // 말풍선 하단에 시간 정렬
                    }}>
                    {/* 💬 말풍선 */}
                    <Box
                        sx={{
                            bgcolor: isMe ? "#FEE500" : "#FFFFFF", // 카카오 노랑 vs 흰색
                            color: "#000",
                            p: "10px 14px",
                            borderRadius: isMe
                                ? "15px 0px 15px 15px"
                                : "0px 15px 15px 15px", // 꼬리 모양 흉내
                            maxWidth: "70vw", // 화면의 70%까지만 차지
                            maxHeight: "40px",
                            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                            wordBreak: "break-word",
                            fontSize: "0.95rem",
                            lineHeight: 1.5,
                        }}>
                        {content}
                    </Box>

                    {/* 🕒 시간 표시 */}
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#555",
                            fontSize: "0.7rem",
                            mx: 0.5,
                            minWidth: "max-content", // 줄바꿈 방지
                        }}>
                        {time}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default MessageBubbleComponent;
