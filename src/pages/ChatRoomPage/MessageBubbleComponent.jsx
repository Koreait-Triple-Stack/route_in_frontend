import React, { useState } from "react";
import UserAvatarLink from "../../components/UserAvatarLink";
import { Box, flex } from "@mui/system";
import { Typography } from "@mui/material";
import { usePrincipalState } from "../../store/usePrincipalState";
import MessageModal from "./MessageModal";
import { useLongPress } from "../../hooks/useLongPress";

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

    const [contextMenuMes, setContextMenuMes] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const openMessageMenu = (e, message) => {
        e.preventDefault?.();
        setSelectedMessage(message);

        const p = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;

        setContextMenuMes({
            mouseX: p.clientX,
            mouseY: p.clientY,
        });
    };

    const handleContextMenu = (e, message) => openMessageMenu(e, message);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row",
                alignItems: "flex-start",
                my: 0.5,
                width: "100%",
                height: "100%",
            }}>
            {!isMe && !isMiddle && (
                <UserAvatarLink userId={senderId} src={profileImg} size={40} />
            )}
            {isMiddle ? (
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        my: 0.5,
                    }}>
                    <Typography
                        sx={{
                            display: "inline-block",
                            bgcolor: "grey.500",
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
                    {!isMe && (
                        <Typography
                            variant="caption"
                            sx={{ color: "#555", ml: 0.5 }}>
                            {username}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isMe ? "row-reverse" : "row",
                            alignItems: "flex-end",
                        }}>
                        {(() => {
                            const bindMsgLongPress = useLongPress({
                                delay: 450,
                                onLongPress: (e) => openMessageMenu(e, message),
                                onClick: () => {},
                            });

                            return (
                                <Box
                                    {...bindMsgLongPress}
                                    onContextMenu={(e) =>
                                        handleContextMenu(e, message)
                                    }
                                    sx={{
                                        bgcolor: isMe
                                            ? "primary.main"
                                            : "#FFFFFF",
                                        color: isMe ? "#FFF" : "#000",
                                        p: "7px 12px",
                                        borderRadius: isMe
                                            ? "15px 0px 15px 15px"
                                            : "0px 15px 15px 15px",
                                        maxWidth: 250,
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                                        fontSize: "0.95rem",
                                        lineHeight: 1.5,

                                        WebkitUserSelect: "none",
                                        userSelect: "none",
                                        WebkitTouchCallout: "none",
                                        touchAction: "pan-y",
                                    }}>
                                    {content}
                                </Box>
                            );
                        })()}

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                alignItems: isMe ? "flex-end" : "flex-start",
                                mx: 0.5,
                                minWidth: 0,
                            }}>
                            {unreadCnt > 0 && (
                                <Box
                                    sx={{
                                        color: "primary.main",
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

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#555",
                                    fontSize: "0.7rem",
                                    whiteSpace: "nowrap",
                                    minWidth: 0,
                                }}>
                                {time}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            <MessageModal
                setContextMenuMes={setContextMenuMes}
                contextMenuMes={contextMenuMes}
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
            />
        </Box>
    );
}

export default MessageBubbleComponent;
