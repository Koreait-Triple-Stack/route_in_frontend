import { Chip, Stack, Typography, Card, CardContent } from "@mui/material";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { getRecommendationCourse } from "../../apis/aiRecommend/aiRecommendService";
import { useQuery } from "@tanstack/react-query";
import Course from "./Course";

function PreviewCard() {
    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getRecommendationCourse"],
        queryFn: () => getRecommendationCourse(),
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    return (
        <Card
            sx={{
                borderRadius: "24px",
                backgroundColor: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(15,23,42,0.10)",
                boxShadow: "0 20px 60px rgba(15,23,42,0.10)",
                overflow: "hidden",
            }}
        >
            <CardContent sx={{ p: 2.4 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack spacing={0.2}>
                        <Typography sx={{ fontWeight: 1000 }}>
                            오늘의 추천 코스
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: "rgba(15,23,42,0.60)" }}
                        >
                            {response?.data?.region}
                        </Typography>
                    </Stack>
                    <Chip
                        size="small"
                        label="NEW"
                        sx={{
                            fontWeight: 900,
                            color: "#166534",
                            bgcolor: "rgba(34,197,94,0.15)",
                            border: "1px solid rgba(34,197,94,0.25)",
                        }}
                    />
                </Stack>

                <Course boardId={response?.data?.boardId} />

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mt: 2 }}
                >
                    {[
                        `거리 ${(response?.data?.distanceM / 1000).toFixed(1)}km`,
                        `예상 ${response?.data?.estimatedMinutes || 0}분`,
                        `난이도 ${response?.data?.level}`,
                    ].map((t) => (
                        <Chip
                            key={t}
                            label={t}
                            sx={{
                                bgcolor: "rgba(15,23,42,0.04)",
                                border: "1px solid rgba(15,23,42,0.10)",
                                fontWeight: 800,
                            }}
                        />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default PreviewCard;
