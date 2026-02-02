import { Paper, Typography, Box, TextField, Divider, IconButton, CircularProgress, Button, Collapse, Stack } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAIChatListByUserId, getAIResp, getTodayRecommendation } from "../../apis/aiRecommend/aiRecommendService";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import RecommendIcon from "@mui/icons-material/Recommend";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import Recommendation from "../../components/Recommendation";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import { useState, useMemo } from "react";

function AIRecommend({ userId }) {
    const queryClient = useQueryClient();
    const [question, setQuestion] = useState("");
    const [newChats, setNewChats] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);

    // 깔끔한 Light 테마 설정
    const THEME = {
        bg: "#FFFFFF",
        subBg: "#F8FAFC",
        accent: "#3B82F6",
        textPrimary: "#1E293B",
        textSecondary: "#64748B",
        border: "#E2E8F0",
    };

    const handleChat = () => setChatOpen(!chatOpen);

    const {
        data: recommendation,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getTodayRecommendation", userId],
        queryFn: () => getTodayRecommendation(userId),
        enabled: !!userId,
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
            setNewChats((prev) => [...prev, { type: "ai", text: "오류가 발생했습니다." }]);
        },
    });

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

    if (isLoading || !recommendation?.data?.aiResp) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    const { routineTitle, routineReason, routineTags, runningTitle, runningReason, runningTags } = recommendation.data.aiResp;

    function AIChat() {
        return (
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Box
                    sx={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        px: 1,
                        "::-webkit-scrollbar": { width: "4px" },
                        "::-webkit-scrollbar-thumb": { bgcolor: "#E2E8F0", borderRadius: "10px" },
                    }}
                >
                    <Stack spacing={2}>
                        {displayChatList.map((chat, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: chat.type === "user" ? "flex-end" : "flex-start",
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        px: 2,
                                        bgcolor: chat.type === "user" ? THEME.accent : THEME.subBg,
                                        color: chat.type === "user" ? "#fff" : THEME.textPrimary,
                                        borderRadius: chat.type === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                        maxWidth: "85%",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {chat.text}
                                </Paper>
                            </Box>
                        ))}
                        {aiMutation.isPending && (
                            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                                <Paper elevation={0} sx={{ p: 1.5, bgcolor: THEME.subBg, borderRadius: "18px", display: "flex", alignItems: "center" }}>
                                    <CircularProgress size={14} sx={{ mr: 1, color: THEME.accent }} />
                                    <Typography variant="caption" color={THEME.textSecondary}>
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
                    }}
                >
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
                    <IconButton onClick={handleSend} disabled={!question.trim() || aiMutation.isPending} sx={{ color: THEME.accent }}>
                        <SendIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Stack>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: "28px",
                bgcolor: THEME.bg,
                border: `1px solid ${THEME.border}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
        >
            <Box display="flex" alignItems="center" mb={3}>
                <RecommendIcon sx={{ color: THEME.accent, mr: 1, fontSize: 26 }} />
                <Typography variant="subtitle1" fontWeight="800" sx={{ color: THEME.textPrimary }}>
                    오늘의 AI 추천 가이드
                </Typography>
            </Box>

            <Stack spacing={3}>
                <Recommendation title={routineTitle} reason={routineReason} tags={routineTags} />
                <Divider sx={{ borderColor: "#F1F5F9" }} />
                <Recommendation title={runningTitle} reason={runningReason} tags={runningTags} />
            </Stack>

            <Box sx={{ mt: 3 }}>
                <Button
                    fullWidth
                    onClick={handleChat}
                    sx={{
                        py: 1.2,
                        borderRadius: "12px",
                        bgcolor: chatOpen ? THEME.subBg : "transparent",
                        color: THEME.accent,
                        border: `1px solid ${chatOpen ? "transparent" : THEME.border}`,
                        textTransform: "none",
                        "&:hover": { bgcolor: THEME.subBg, border: "1px solid transparent" },
                    }}
                >
                    <SmartToyIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="700">
                        AI 코치 질문하기
                    </Typography>
                    {chatOpen ? <ExpandLess sx={{ ml: 0.5 }} /> : <ExpandMore sx={{ ml: 0.5 }} />}
                </Button>

                <Collapse in={chatOpen} timeout="auto" unmountOnExit>
                    <AIChat />
                </Collapse>
            </Box>
        </Paper>
    );
}

export default AIRecommend;
