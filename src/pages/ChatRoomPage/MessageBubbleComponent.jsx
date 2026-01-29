import React from "react";
import UserAvatarLink from "../../components/UserAvatarLink";
import { Box, flex } from "@mui/system";
import { Badge, Typography } from "@mui/material";
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
    const isMiddle = !message.senderId;
    const isMe = message.senderId === principal?.userId;
    const event = new Date(createDt);
    const time = event.toLocaleString("ko-KR", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row", // 내꺼면 오른쪽, 남이면 왼쪽
                alignItems: "flex-start",
                mb: 2,
                width: "100%",
                height: "100%",
            }}>
            {(!isMe && !isMiddle) && (
                <UserAvatarLink userId={senderId} src={profileImg} size={48} />
            )}
            {isMiddle ? (
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", mb: 1, mt: 1 }}>
                    <Typography
                        sx={{
                            display: "inline-block",
                            bgcolor: "rgba(0,0,0,0.1)",
                            color: "#fff",
                            px: 2,
                            py: 0.5,
                            borderRadius: 10,
                            fontSize: "0.75rem",
                        }}>
                        {message.content}
                    </Typography>
                </Box>
            ) : (
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

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                alignItems: isMe ? "flex-end" : "flex-start",
                                mx: 0.5,
                                height: "100%",
                            }}>
                            {/* 안읽은 표시 (Badge 대신 Box나 Typography로 직접 구현이 위치 잡기 더 쉽습니다) */}
                            {unreadCnt > 0 && (
                                <Box
                                    sx={{
                                        color: "#fffb00",
                                        fontSize: "0.75rem",
                                        fontWeight: "bold",
                                        height: "10px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    {unreadCnt}
                                </Box>
                            )}

                            {/* 시간 표시 */}
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#555",
                                    fontSize: "0.7rem",
                                    minWidth: "max-content",
                                }}>
                                {time}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default MessageBubbleComponent;
