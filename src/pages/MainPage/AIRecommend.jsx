import { Paper, Typography, Card, Box, TextField, Divider, IconButton, CircularProgress } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAIResp, getTodayRecommendation } from "../../apis/aiRecommend/aiRecommendService";
import RecommendIcon from "@mui/icons-material/Recommend";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import Recommendation from "../../components/Recommendation";
import { Stack } from "@mui/system";
import SmartToyIcon from "@mui/icons-material/SmartToy"; 
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

function AIRecommend({ userId }) {
    const queryClient = useQueryClient();
    const [question, setQuestion] = useState("");
    const [chatList, setChatList] = useState([]);

    const {
        data: recommendation,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getTodayRecommendation", userId],
        queryFn: () => getTodayRecommendation(userId),
        enabled: !!userId,
    });

    const aiMutation = useMutation({
        mutationFn: (question) => getAIResp({ userId, question: question }),
        onMutate: async (question) => {
            const newChat = { type: "user", text: question };
            setChatList((prev) => [...prev, newChat]);
            setQuestion("");
        },
        onSuccess: (data) => {
            const aiReply = data?.data?.resp || "답변을 받아오지 못했습니다.";
            setChatList((prev) => [...prev, { type: "ai", text: aiReply }]);
        },
        onError: () => {
            setChatList((prev) => [...prev, { type: "ai", text: "오류가 발생했습니다. 다시 시도해주세요." }]);
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

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    const { routineTitle, routineReason, routineTags, runningTitle, runningReason, runningTags } = recommendation?.data?.aiResp;

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <RecommendIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" component="h2" fontWeight="bold">
                    오늘의 운동 추천
                </Typography>
            </Box>
            <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "background.default" }}>
                <Recommendation title={routineTitle} reason={routineReason} tags={routineTags} />
                <Recommendation title={runningTitle} reason={runningReason} tags={runningTags} />
                <Divider sx={{ my: 2 }} />

                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                        <SmartToyIcon fontSize="small" sx={{ mr: 1 }} /> AI 코치에게 물어보세요
                    </Typography>

                    {/* 채팅 내역 표시 영역 */}
                    <Stack spacing={2} sx={{ mb: 2, maxHeight: "300px", overflowY: "auto" }}>
                        {chatList.map((chat, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: chat.type === "user" ? "flex-end" : "flex-start",
                                    alignItems: "flex-start",
                                }}
                            >
                                {/* 아이콘 표시 */}
                                {chat.type === "ai" && <SmartToyIcon color="action" sx={{ mr: 1, mt: 0.5 }} />}

                                {/* 말풍선 */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        bgcolor: chat.type === "user" ? "primary.main" : "grey.200",
                                        color: chat.type === "user" ? "white" : "text.primary",
                                        borderRadius: 2,
                                        maxWidth: "80%",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    <Typography variant="body2">{chat.text}</Typography>
                                </Paper>

                                {chat.type === "user" && <PersonIcon color="action" sx={{ ml: 1, mt: 0.5 }} />}
                            </Box>
                        ))}
                        {aiMutation.isPending && (
                            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
                                <SmartToyIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        bgcolor: "grey.200",
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {/* 텍스트 대신 로딩 스피너 혹은 점 3개 애니메이션 */}
                                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                        답변 생성 중...
                                        <CircularProgress size={16} sx={{ ml: 1 }} />
                                    </Typography>
                                </Paper>
                            </Box>
                        )}
                    </Stack>

                    {/* 입력 영역 */}
                    <Box display="flex" alignItems="flex-end" sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={3}
                            placeholder="이 운동은 얼마나 해야 해? 무릎이 아픈데 괜찮아?"
                            variant="outlined"
                            size="small"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={aiMutation.isPending}
                            sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                        />
                        <IconButton color="primary" onClick={handleSend} disabled={!question.trim() || aiMutation.isPending} sx={{ ml: 1, mb: 0.5 }}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Card>
        </Paper>
    );
}

export default AIRecommend;
