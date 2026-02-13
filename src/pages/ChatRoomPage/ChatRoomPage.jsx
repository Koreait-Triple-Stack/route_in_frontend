import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const { roomId: roomIdParam } = useParams();
    const [isInvite, setIsInvite] = useState();
    const roomId = Number(roomIdParam);

    const inputRef = useRef(null);
    const composerRef = useRef(null);

    const [isCoarsePointer, setIsCoarsePointer] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(pointer: coarse)");
        const update = () => setIsCoarsePointer(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

    // 입력창 높이만큼 메시지 영역 padding-bottom 자동 계산용 (가장 깔끔)
    const [composerH, setComposerH] = useState(72);
    useLayoutEffect(() => {
        const el = composerRef.current;
        if (!el) return;

        const ro = new ResizeObserver(() => {
            setComposerH(el.getBoundingClientRect().height || 72);
        });
        ro.observe(el);
        setComposerH(el.getBoundingClientRect().height || 72);

        return () => ro.disconnect();
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

        if (!isCoarsePointer) {
            requestAnimationFrame(() => focusInput());
        }
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

    console.log(window.innerWidth);
    console.log(document.documentElement.clientWidth);
    console.log(document.documentElement.scrollWidth);

    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                bgcolor: "#F5F7FA",
                width: "100%",
                overflow: "hidden",
            }}>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    transform: "translateZ(0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "#F5F7FA",
                    borderBottom: "1px solid #dbdbdb",
                    pt: "env(safe-area-inset-top, 0px)",
                }}>
                <IconButton edge="start" color="inherit" onClick={handleBack}>
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
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                    pb: `${composerH}`,
                }}>
                <MessageBubble roomId={roomId} />
            </Box>

            <Box
                ref={composerRef}
                sx={{
                    position: "sticky",
                    bottom: 0,
                    zIndex: 10,
                    transform: "translateZ(0)",
                    bgcolor: "#fff",
                    borderTop: "1px solid #ddd",
                    paddingBottom: "env(safe-area-inset-bottom, 0px)",
                }}>
                <Box
                    sx={{
                        width: "100%",
                        p: 1.5,
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
                            minWidth: 0,
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
                            onKeyDown={
                                isCoarsePointer ? undefined : handleKeyDown
                            }
                            sx={{
                                "& .MuiInputBase-root": {
                                    fontSize: "1rem",
                                    p: 0.5,
                                },
                                "& .MuiInputBase-input": {
                                    fontSize: "1rem",
                                },
                            }}
                        />
                    </Box>

                    <IconButton
                        tabIndex={-1}
                        onPointerDown={(e) => e.preventDefault()}
                        onMouseDown={(e) => e.preventDefault()}
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
        </Box>
    );
}

export default ChatRoomPage;
