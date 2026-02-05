import {
    Paper,
    Typography,
    Box,
    Divider,
    Button,
    Collapse,
    Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getTodayRecommendation } from "../../apis/aiRecommend/aiRecommendService";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import RecommendIcon from "@mui/icons-material/Recommend";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import Recommendation from "../../components/Recommendation";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import { useState, useMemo } from "react";
import AIChat from "./AIChat";

function AIRecommend({ userId }) {
    const [chatOpen, setChatOpen] = useState(false);

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

    if (isLoading || !recommendation?.data?.aiResp) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    const {
        routineTitle,
        routineReason,
        routineTags,
        runningTitle,
        runningReason,
        runningTags,
    } = recommendation.data.aiResp;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: "28px",
                bgcolor: THEME.bg,
                border: `1px solid ${THEME.border}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}>
            <Box display="flex" alignItems="center" mb={3}>
                <RecommendIcon
                    sx={{ color: THEME.accent, mr: 1, fontSize: 26 }}
                />
                <Typography
                    variant="subtitle1"
                    fontWeight="800"
                    sx={{ color: THEME.textPrimary }}>
                    오늘의 AI 추천 가이드
                </Typography>
            </Box>

            <Stack spacing={3}>
                <Recommendation
                    title={routineTitle}
                    reason={routineReason}
                    tags={routineTags}
                />
                <Divider sx={{ borderColor: "#F1F5F9" }} />
                <Recommendation
                    title={runningTitle}
                    reason={runningReason}
                    tags={runningTags}
                />
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
                        "&:hover": {
                            bgcolor: THEME.subBg,
                            border: "1px solid transparent",
                        },
                    }}>
                    <SmartToyIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="700">
                        AI 코치 질문하기
                    </Typography>
                    {chatOpen ? (
                        <ExpandLess sx={{ ml: 0.5 }} />
                    ) : (
                        <ExpandMore sx={{ ml: 0.5 }} />
                    )}
                </Button>

                <Collapse in={chatOpen} timeout="auto" unmountOnExit>
                    <AIChat userId={userId} />
                </Collapse>
            </Box>
        </Paper>
    );
}

export default AIRecommend;
