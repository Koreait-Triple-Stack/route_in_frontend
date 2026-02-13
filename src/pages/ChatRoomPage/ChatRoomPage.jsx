import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Stack,
    Portal,
} from "@mui/material";
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
import useVisualTop from "./useVisualTop";

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
    const visualTop = useVisualTop();

    const inputRef = useRef(null);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const msgAreaRef = useRef(null);

    const [isCoarsePointer, setIsCoarsePointer] = useState(false);
    const [footerBottom, setFooterBottom] = useState(0);
    const [headerH, setHeaderH] = useState(0);
    const [footerH, setFooterH] = useState(0);

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        const prevBodyPosition = body.style.position;
        const prevBodyWidth = body.style.width;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        body.style.position = "fixed";
        body.style.width = "100%";

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
            body.style.position = prevBodyPosition;
            body.style.width = prevBodyWidth;
        };
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(pointer: coarse)");
        const update = () => setIsCoarsePointer(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const update = () => {
            const hiddenBottom = Math.max(0, window.innerHeight - vv.height);
            setFooterBottom(hiddenBottom);
        };

        update();
        vv.addEventListener("resize", update);
        return () => vv.removeEventListener("resize", update);
    }, []);

    useEffect(() => {
        const ro = new ResizeObserver(() => {
            setHeaderH(headerRef.current?.offsetHeight ?? 0);
            setFooterH(footerRef.current?.offsetHeight ?? 0);
        });

        if (headerRef.current) ro.observe(headerRef.current);
        if (footerRef.current) ro.observe(footerRef.current);

        setHeaderH(headerRef.current?.offsetHeight ?? 0);
        setFooterH(footerRef.current?.offsetHeight ?? 0);

        return () => ro.disconnect();
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

    useEffect(() => {
        const onTouchMove = (e) => {
            const el = msgAreaRef.current;
            if (!el) {
                e.preventDefault();
                return;
            }
            if (!el.contains(e.target)) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", onTouchMove, { passive: false });
        return () => {
            document.removeEventListener("touchmove", onTouchMove);
        };
    }, []);


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
            requestAnimationFrame(() => {
                focusInput();
            });
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

    return (
        <Box sx={{ height: "100%", width: "100%", backgroundColor: "#F5F7FA" }}>
            <Portal>
                <Box
                    ref={headerRef}
                    sx={{
                        position: "fixed",
                        top: `${visualTop}px`,
                        left: 0,
                        right: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1.5,
                        py: 0.5,
                        bgcolor: "#F5F7FA",
                        borderBottom: "1px solid #dbdbdb",
                        paddingTop:
                            "calc(env(safe-area-inset-top, 0px) + 12px)",
                        zIndex: 1300,
                    }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleBack}>
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
                        <IconButton
                            color="inherit"
                            onClick={() => setIsMenu(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </Portal>

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
                ref={msgAreaRef}
                sx={{
                    py: 8,
                    position: "fixed",
                    left: 0,
                    right: 0,
                    top: `calc(${visualTop}px + ${headerH}px)`,
                    bottom: `${footerBottom + footerH}px`,
                    overflowY: "auto",
                    overflowX: "hidden",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "contain",
                }}>
                <MessageBubble roomId={roomId} />
            </Box>

            <Portal>
                <Box
                    ref={footerRef}
                    sx={{
                        position: "fixed",
                        left: 0,
                        right: 0,
                        bottom: `${footerBottom}px`,
                        width: "100%",
                        flexShrink: 0,
                        transition: "bottom 120ms ease-out",
                        zIndex: 1300,
                    }}>
                    <Box
                        sx={{
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
            </Portal>
        </Box>
    );
}

export default ChatRoomPage;
