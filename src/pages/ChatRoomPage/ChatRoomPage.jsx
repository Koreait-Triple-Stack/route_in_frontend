import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, IconButton, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePrincipalState } from "../../store/usePrincipalState";
import {
    addMessageRequest,
    getRoomByRoomIdRequest,
} from "../../apis/chat/chatApi";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { useToastStore } from "../../store/useToastStore";
import { useChatUiState } from "../../store/useChatUiState";
import MenuDrawer from "./MenuDrawer";
import InviteDialog from "./InviteDialog";
import useLockBodyScroll from "./useLockBodyScroll";

function ChatRoomPage() {
    const { show } = useToastStore();
    const [inputValue, setInputValue] = useState("");
    const [isMenu, setIsMenu] = useState(false);
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const { roomId: roomIdParam } = useParams();
    const [isInvite, setIsInvite] = useState();
    const roomId = Number(roomIdParam);

    const scrollerRef = useRef(null);

    const inputRef = useRef(null);
    const [isCoarsePointer, setIsCoarsePointer] = useState(false);

    const [hasHardwareKeyboard, setHasHardwareKeyboard] = useState(false);

    const isMobileTyping = isCoarsePointer && !hasHardwareKeyboard;

    useLockBodyScroll(true, scrollerRef);

    useEffect(() => {
        const onKeyDown = () => setHasHardwareKeyboard(true);
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(pointer: coarse)");
        const update = () => setIsCoarsePointer(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

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
        onError: (resp) => show(resp.message, "error"),
    });

    const setActiveRoomId = useChatUiState((s) => s.setActiveRoomId);

    useEffect(() => {
        if (!roomId) return;
        setActiveRoomId(Number(roomId));
        return () => setActiveRoomId(null);
    }, [roomId, setActiveRoomId]);

    const handleSend = ({ keepFocus } = { keepFocus: false }) => {
        if (!inputValue.trim()) return;

        mutation.mutate({
            roomId,
            senderId: principal.userId,
            type: "text",
            content: inputValue,
        });

        setInputValue("");

        if (keepFocus) {
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    };

    const handleKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;

        if (isMobileTyping) return;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend({ keepFocus: true });
        }
    };

    if (roomLoading) return <Loading />;
    if (roomError) return <ErrorComponent error={roomError} />;

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1200,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    bgcolor: "#f2f2f2",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
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
                setIsMenu={setIsMenu}
                isMenu={isMenu}
                setIsInvite={setIsInvite}
                participants={room?.participants}
            />

            <InviteDialog
                isInvite={isInvite}
                setIsInvite={setIsInvite}
                setIsMenu={setIsMenu}
                participants={room.participants}
                roomId={roomId}
            />

            <Box
                ref={scrollerRef}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    minWidth: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                    overscrollBehavior: "contain",
                    touchAction: "pan-y",
                    WebkitOverflowScrolling: "touch",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}>
                <MessageBubble roomId={roomId} scrollerRef={scrollerRef} />
            </Box>

            <Box
                sx={{
                    position: "sticky",
                    bottom: 0,
                    zIndex: 1200,
                    bgcolor: "#fff",
                    borderTop: "1px solid #ddd",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                }}>
                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "#fff",
                        display: "flex",
                        alignItems: "center",
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
                            inputRef={inputRef}
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
                                    fontSize: "1rem",
                                    p: 0.5,
                                },
                                "& .MuiInputBase-input": { fontSize: "1rem" },
                            }}
                        />
                    </Box>

                    <IconButton
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={(e) => e.preventDefault()}
                        onClick={() => handleSend({ keepFocus: true })}
                        sx={{
                            bgcolor: inputValue.trim()
                                ? "primary.main"
                                : "transparent",
                            color: inputValue.trim() ? "#FFF" : "#ddd",
                            "&:hover": {
                                bgcolor: inputValue.trim()
                                    ? "primary.dark"
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
