import React, { useEffect, useRef, useState } from "react";
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
import { useChatUiState } from "../../store/useChatUiState";
import MenuDrawer from "./MenuDrawer";
import InviteDialog from "./InviteDialog";

function ChatRoomPage() {
    const queryClient = useQueryClient();
    const { show } = useToastStore();

    const [inputValue, setInputValue] = useState("");
    const [isMenu, setIsMenu] = useState(false);
    const [isInvite, setIsInvite] = useState(false);

    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const { roomId: roomIdParam } = useParams();
    const roomId = Number(roomIdParam);

    const inputRef = useRef(null);
    const messageRef = useRef(null);
    const [isCoarsePointer, setIsCoarsePointer] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(pointer: coarse)");
        const update = () => setIsCoarsePointer(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

    useEffect(() => {
        const scrollerSelector = "[data-chat-scroller='1']";
        let lastY = 0;

        const getScroller = () => document.querySelector(scrollerSelector);

        const onTouchStart = (e) => {
            const t = e.touches?.[0];
            if (t) lastY = t.clientY;
        };

        const onTouchMove = (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;

            if (target.closest("input, textarea, [contenteditable='true']")) {
                return;
            }
            const scroller = getScroller();
            if (!scroller) return;

            if (!scroller.contains(target)) {
                e.preventDefault();
                return;
            }

            const t = e.touches?.[0];
            if (!t) return;

            const currentY = t.clientY;
            const deltaY = currentY - lastY;
            lastY = currentY;

            const { scrollTop, scrollHeight, clientHeight } = scroller;
            const atTop = scrollTop <= 0;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchstart", onTouchStart, {
            passive: true,
        });
        document.addEventListener("touchmove", onTouchMove, { passive: false });

        return () => {
            document.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
        };
    }, []);

    const {
        data: roomResp,
        isLoading: roomLoading,
        error: roomError,
    } = useQuery({
        queryKey: ["getRoomByRoomIdRequest", roomId],
        queryFn: () => getRoomByRoomIdRequest(roomId),
        enabled: Number.isFinite(roomId) && roomId > 0,
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

    const focusInput = () => {
        const el = inputRef.current;
        if (!el) return;
        if (document.activeElement === el) return;

        try {
            el.focus({ preventScroll: true });
        } catch {
            el.focus();
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        mutation.mutate({
            roomId,
            senderId: principal.userId,
            type: "text",
            content: inputValue,
        });

        setInputValue("");

        if (!isCoarsePointer) requestAnimationFrame(() => focusInput());
    };

    const handleKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (isCoarsePointer) return;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleBack = () => {
        navigate("/chat");
        queryClient.removeQueries([
            "getMessageListInfiniteRequest",
            { roomId, userId: principal?.userId, limit: 20 },
        ]);
    };

    if (roomLoading) return <Loading />;
    if (roomError) return <ErrorComponent error={roomError} />;

    const title =
        room?.participants?.find((p) => p.userId === principal?.userId)
            ?.title ?? "";

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                bgcolor: "#F5F7FA",
            }}>
            <Box
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "#F5F7FA",
                    borderBottom: "1px solid #dbdbdb",
                    paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
                }}>
                <IconButton edge="start" color="inherit" onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {title}
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

            <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                <MessageBubble ref={messageRef} roomId={roomId} />
            </Box>

            <Box
                sx={{
                    flexShrink: 0,
                    width: "100%",
                    bgcolor: "#fff",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    borderTop: "1px solid #ddd",
                    paddingBottom:
                        "calc(env(safe-area-inset-bottom, 0px) + 12px)",
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
                        inputRef={inputRef}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={isCoarsePointer ? undefined : handleKeyDown}
                        onFocus={() => {
                            messageRef.current?.scrollToBottom();
                        }}
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
                    tabIndex={-1}
                    onPointerDown={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.preventDefault()}
                    onTouchStart={(e) => e.preventDefault()}
                    onClick={handleSend}
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
    );
}

export default ChatRoomPage;
