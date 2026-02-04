import {
    Box,
    Chip,
    Stack,
    Typography,
    Card,
    CardContent,
} from "@mui/material";

function PreviewCard() {
    return (
        <Card
            sx={{
                borderRadius: "24px",
                backgroundColor: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(15,23,42,0.10)",
                boxShadow: "0 20px 60px rgba(15,23,42,0.10)",
                overflow: "hidden",
            }}>
            <CardContent sx={{ p: 2.4 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <Stack spacing={0.2}>
                        <Typography sx={{ fontWeight: 1000 }}>
                            오늘의 추천 코스
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: "rgba(15,23,42,0.60)" }}>
                            서울 · 한강 러닝
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

                <Box
                    sx={{
                        mt: 2,
                        height: 190,
                        borderRadius: "18px",
                        border: "1px solid rgba(15,23,42,0.10)",
                        background:
                            "radial-gradient(700px 280px at 20% 30%, rgba(37,99,235,0.16), transparent 65%)," +
                            "radial-gradient(600px 260px at 70% 50%, rgba(34,197,94,0.14), transparent 60%)," +
                            "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.9))",
                    }}
                />
                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mt: 2 }}>
                    {[
                        "거리 6.2km",
                        "예상 38분",
                        "난이도 보통",
                        "야경 추천",
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

export default PreviewCard