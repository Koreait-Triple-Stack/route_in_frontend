import { Paper, Typography, Card, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAIContext } from "../../apis/aiRecommend/aiRecommendService";
import RecommendIcon from "@mui/icons-material/Recommend";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import Recommendation from "../../components/Recommendation";

function AIRecommend({ userId }) {
    const [question, setQuestion] = useState("");
    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getAIContext", userId],
        queryFn: () => getAIContext(userId),
        enabled: !!userId,
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    const { routineTitle, routineReason, routineTags, runningTitle, runningReason, runningTags } = response?.data?.aiResp;

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
                {/* <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="질문 입력"
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    sx={{
                        "& .MuiInputBase-root": {
                            fontSize: "0.95rem",
                            p: 0.5,
                        },
                    }}
                /> */}
            </Card>
        </Paper>
    );
}

export default AIRecommend;
