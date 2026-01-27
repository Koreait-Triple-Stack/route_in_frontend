import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Stack,
    AppBar,
    Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Grid } from "@mui/system";
import MenuDrawer from "./MenuDrawer";
import MessageBubble from "./MessageBubble";
import { useQuery } from "@tanstack/react-query";
import { usePrincipalState } from "../../store/usePrincipalState";
import { getRoomByRoomIdRequest } from "../../apis/chat/chatApi";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";

// ✅ 더미 데이터
const INITIAL_MESSAGES = [
    {
        id: 22,
        text: "오늘 저녁에 시간 되시나요?",
        time: "오후 2:30",
        isMe: false,
        sender: "김개발",
        profile: "",
    },
    {
        id: 2,
        text: "네! 7시쯤 괜찮을 것 같아요.",
        time: "오후 2:31",
        isMe: true,
    },
    {
        id: 3,
        text: "좋아요. 어디서 볼까요?",
        time: "오후 2:32",
        isMe: false,
        sender: "김개발",
        profile: "",
    },
    {
        id: 4,
        text: "강남역 근처 어떠세요? 맛집 찾아볼게요!",
        time: "오후 2:33",
        isMe: true,
    },
    {
        id: 5,
        text: "넵 알겠습니다 ㅎㅎ",
        time: "오후 2:35",
        isMe: false,
        sender: "김개발",
        profile: "",
    },
];

// 🏠 2. 메인 채팅방 컴포넌트
function ChatRoomPage() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isMenu, setIsMenu] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const { roomId: roomIdParam } = useParams();
    const roomId = Number(roomIdParam);
    const {
        data: roomResp,
        isLoading: roomLoading,
        error: roomError,
    } = useQuery({
        queryKey: ["getRoomByRoomIdRequest", 7],
        queryFn: () => getRoomByRoomIdRequest(7),
        staleTime: 30000,
    });
    const room = roomResp?.data ?? {};

    // 스크롤 자동 내리기
    // useEffect(() => {
    //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (roomLoading) return <Loading />;
    if (roomError) return <ErrorComponent error={roomError} />;

    return (
        <Container sx={{ height: "100%" }} disableGutters>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "#b2c7da", // ✅ 카카오톡 기본 배경색
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                }}>
                {/* 🟦 상단 헤더 */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{ bgcolor: "transparent", pt: 1 }}>
                    <Toolbar
                        sx={{ justifyContent: "space-between", color: "#000" }}>
                        <IconButton edge="start" color="inherit">
                            <ArrowBackIcon onClick={() => navigate("/chat")} />
                        </IconButton>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                            {
                                room?.participants.find(
                                    (p) => p.userId === principal?.userId,
                                ).title
                            }
                        </Typography>
                        <Stack direction="row">
                            <IconButton color="inherit">
                                <MenuIcon onClick={() => setIsMenu(true)} />
                            </IconButton>
                        </Stack>
                    </Toolbar>
                </AppBar>

                {/* <MenuDrawer
                    setIsMenu={setIsMenu}
                    isMenu={isMenu}
                    participants={room?.participants}
                /> */}
                <MessageBubble scrollRef={scrollRef} messages={messages} />

                {/* ⌨️ 하단 입력창 */}
                <Box
                    sx={{
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
        </Container>
    );
}

export default ChatRoomPage;
