import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, IconButton, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePrincipalState } from "../../store/usePrincipalState";
import {
    addMessageRequest,
    getRoomByRoomIdRequest,
} from "../../apis/chat/chatApi";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { useToastStore } from "../../store/useToastStore";
import { useNotificationWS } from "../../hooks/useNotificationWS";
import { useChatUiState } from "../../store/useChatUiState";
import MenuDrawer from "./MenuDrawer";
import InviteDialog from "./InviteDialog";

function ChatRoomPage() {
    const { show } = useToastStore();
    const [inputValue, setInputValue] = useState("");
    const [isMenu, setIsMenu] = useState(false);
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const { roomId: roomIdParam } = useParams();
    const chatAreaRef = useRef();
    const [isInvite, setIsInvite] = useState();
    const roomId = Number(roomIdParam);
    const {
        data: roomResp,
        isLoading: roomLoading,
        error: roomError,
    } = useQuery({
        queryKey: ["getRoomByRoomIdRequest", roomId],
        queryFn: () => getRoomByRoomIdRequest(roomId),
    });
    const room = roomResp?.data ?? {};

    const mutation = useMutation({
        mutationFn: addMessageRequest,
        onError: (resp) => {
            show(resp.message, "error");
        },
    });
    const setActiveRoomId = useChatUiState((s) => s.setActiveRoomId);

    useEffect(() => {
        if (!roomId) return;
        setActiveRoomId(Number(roomId));
        return () => setActiveRoomId(null);
    }, [roomId, setActiveRoomId]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        mutation.mutate({
            roomId,
            senderId: principal.userId,
            type: "text",
            content: inputValue,
        });

        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (roomLoading) return <Loading />;
    if (roomError) return <ErrorComponent error={roomError} />;

    return (
        <Box
            position="relative"
            ref={chatAreaRef}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f2f2f2",
            }}>
            {/* 🟦 상단 헤더 */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexShrink: 0,
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => navigate("/chat")}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {
                        room?.participants.find(
                            (p) => p.userId === principal?.userId,
                        )?.title
                    }
                </Typography>
                <Stack direction="row">
                    <IconButton color="inherit" onClick={() => setIsMenu(true)}>
                        <MenuIcon />
                    </IconButton>
                </Stack>
            </Box>

            <MenuDrawer
                chatAreaRef={chatAreaRef}
                setIsMenu={setIsMenu}
                isMenu={isMenu}
                setIsInvite={setIsInvite}
                participants={room?.participants}
            />

            <InviteDialog
                isInvite={isInvite}
                setIsInvite={setIsInvite}
                setIsMenu={setIsMenu}
                title={room.participants.map(part => part.username).join(", ")}
                roomId={roomId}
                participantIds={new Set(room?.participants.map(part => Number(part.userId)))}
            />

            <MessageBubble roomId={roomId} />

            <Box sx={{ flexShrink: 0 }}>
                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "#fff",
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        borderTop: "1px solid #ddd",
                    }}>
                    <Box
                        sx={{
                            flex: 1,
                            bgcolor: "#f5f5f5",
                            borderRadius: 5,
                            px: 2,
                            py: 0.5,
                            mx: 1,
                            display: "flex",
                            alignItems: "center",
                        }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={3}
                            placeholder="메시지 입력"
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            sx={{
                                "& .MuiInputBase-root": {
                                    fontSize: "0.95rem",
                                    p: 0.5,
                                },
                            }}
                        />
                    </Box>

                    <IconButton
                        onClick={handleSend}
                        sx={{
                            bgcolor: inputValue.trim()
                                ? "#FEE500"
                                : "transparent", // 입력 시 노란색 활성화
                            color: inputValue.trim() ? "#000" : "#ddd",
                            "&:hover": {
                                bgcolor: inputValue.trim()
                                    ? "#E6CF00"
                                    : "transparent",
                            },
                        }}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default ChatRoomPage;
