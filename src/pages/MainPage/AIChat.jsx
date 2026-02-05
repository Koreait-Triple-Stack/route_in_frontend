import {
    Paper,
    Typography,
    Box,
    TextField,
    IconButton,
    CircularProgress,
    Stack,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useRef, useEffect } from "react";
import {
    getAIChatListByUserId,
    getAIResp,
} from "../../apis/aiRecommend/aiRecommendService";
import SendIcon from "@mui/icons-material/Send";

function AIChat({ userId }) {
    const queryClient = useQueryClient();
    const [question, setQuestion] = useState("");
    const [newChats, setNewChats] = useState([]);
    const scrollRef = useRef(null);

    const THEME = {
        bg: "#FFFFFF",
        subBg: "#F8FAFC",
        accent: "#3B82F6",
        textPrimary: "#1E293B",
        textSecondary: "#64748B",
        border: "#E2E8F0",
    };

    const aiMutation = useMutation({
        mutationFn: (question) => getAIResp({ userId, question }),
        onMutate: async (question) => {
            setNewChats((prev) => [...prev, { type: "user", text: question }]);
            setQuestion("");
        },
        onSuccess: () => {
            setNewChats([]);
            queryClient.invalidateQueries(["getAIChatListByUserId", userId]);
        },
        onError: () => {
            setNewChats((prev) => [
                ...prev,
                { type: "ai", text: "오류가 발생했습니다." },
            ]);
        },
    });

    const { data: chatList } = useQuery({
        queryKey: ["getAIChatListByUserId", userId],
        queryFn: () => getAIChatListByUserId(userId),
        enabled: !!userId,
    });

    const historyChat = useMemo(() => {
        if (!chatList?.data) return [];
        return chatList.data.flatMap((chat) => [
            { type: "user", text: chat.question },
            { type: "ai", text: chat.resp },
        ]);
    }, [chatList]);

    const displayChatList = [...historyChat, ...newChats];

    const handleSend = () => {
        if (!question.trim()) return;
        aiMutation.mutate(question);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const scrollToBottom = () => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    };

    useEffect(() => {
        scrollToBottom();
    }, [displayChatList.length, aiMutation.isPending]);

    return (
        <Stack spacing={2} sx={{ mt: 2 }}>
            <Box
                ref={scrollRef}
                sx={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    p: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    "::-webkit-scrollbar": { width: "4px" },
                    "::-webkit-scrollbar-thumb": {
                        bgcolor: "#E2E8F0",
                        borderRadius: "10px",
                    },
                }}>
                <Stack spacing={2}>
                    {displayChatList.map((chat, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent:
                                    chat.type === "user"
                                        ? "flex-end"
                                        : "flex-start",
                            }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    px: 2,
                                    bgcolor:
                                        chat.type === "user"
                                            ? THEME.accent
                                            : THEME.subBg,
                                    color:
                                        chat.type === "user"
                                            ? "#fff"
                                            : THEME.textPrimary,
                                    borderRadius:
                                        chat.type === "user"
                                            ? "18px 18px 4px 18px"
                                            : "18px 18px 18px 4px",
                                    maxWidth: "85%",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    lineHeight: 1.5,
                                }}>
                                {chat.text}
                            </Paper>
                        </Box>
                    ))}
                    {aiMutation.isPending && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                            }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    bgcolor: THEME.subBg,
                                    borderRadius: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                <CircularProgress
                                    size={14}
                                    sx={{ mr: 1, color: THEME.accent }}
                                />
                                <Typography
                                    variant="caption"
                                    color={THEME.textSecondary}>
                                    답변 생성 중...
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </Stack>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: THEME.subBg,
                    borderRadius: "12px",
                    p: "4px 8px",
                }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="궁금한 점을 물어보세요"
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={aiMutation.isPending}
                    sx={{ px: 1, py: 1, fontSize: "0.875rem" }}
                />
                <IconButton
                    onClick={handleSend}
                    disabled={!question.trim() || aiMutation.isPending}
                    sx={{ color: THEME.accent }}>
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Stack>
    );
}

export default AIChat;
