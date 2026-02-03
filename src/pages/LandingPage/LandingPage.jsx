import React, { useEffect } from "react";
import {
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Stack,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { usePrincipalState } from "../../store/usePrincipalState";

export default function LandingPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = usePrincipalState();

    if (isLoggedIn) {
        navigate("/main");
    }

    return (
        <Container sx={{ py: { xs: 6, md: 9 } }}>
            <Grid container spacing={4} alignItems="center">
                {/* 좌측 텍스트 */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap>
                            <Chip
                                icon={<MapRoundedIcon />}
                                label="코스 탐색"
                                sx={chipStyle}
                            />
                            <Chip
                                icon={<WhatshotRoundedIcon />}
                                label="루틴 공유"
                                sx={chipStyle}
                            />
                            <Chip
                                icon={<FavoriteRoundedIcon />}
                                label="커뮤니티"
                                sx={chipStyle}
                            />
                        </Stack>

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 1000,
                                letterSpacing: -0.8,
                                lineHeight: 1.12,
                                wordBreak: "keep-all",
                            }}>
                            러닝 코스와 루틴을{" "}
                            <Box
                                component="span"
                                sx={{
                                    display: "inline-block",
                                    px: 1.2,
                                    py: 0.2,
                                    borderRadius: "14px",
                                    background:
                                        "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(34,197,94,0.14))",
                                }}>
                                공유
                            </Box>
                            하고 추천받으세요
                        </Typography>

                        <Typography
                            sx={{
                                color: "rgba(15,23,42,0.72)",
                                lineHeight: 1.8,
                                maxWidth: 520,
                            }}>
                            나에게 맞는 러닝 코스를 찾고, 운동 루틴을 기록하고,
                            사람들과 함께 달리는 즐거움을 만들어보세요. Route
                            In은 코스·루틴·기록을 한 곳에서 관리합니다.
                        </Typography>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            sx={{ mt: 1 }}>
                            <Button
                                size="large"
                                variant="contained"
                                onClick={() => navigate("/oauth2/signin")}
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={primaryBtn}>
                                로그인하고 시작
                            </Button>
                            <Button
                                size="large"
                                variant="outlined"
                                onClick={() => navigate("/oauth2/signup")}
                                sx={secondaryBtn}>
                                회원가입
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>

                {/* 우측 카드 프리뷰 */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                        <PreviewCard />
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}>
                            <FeatureMini
                                icon={<MapRoundedIcon />}
                                title="코스 추천"
                                desc="취향 기반 추천 & 탐색"
                            />
                            <FeatureMini
                                icon={<AutoAwesomeRoundedIcon />}
                                title="기록 관리"
                                desc="루틴/메모를 한 곳에"
                            />
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

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

function FeatureMini({ icon, title, desc }) {
    return (
        <Card
            sx={{
                flex: 1,
                borderRadius: "18px",
                backgroundColor: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(15,23,42,0.10)",
                boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
            }}>
            <CardContent sx={{ p: 2 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        background:
                            "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(34,197,94,0.14))",
                        border: "1px solid rgba(15,23,42,0.10)",
                        mb: 1,
                    }}>
                    {icon}
                </Box>
                <Typography sx={{ fontWeight: 1000 }}>{title}</Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "rgba(15,23,42,0.68)", lineHeight: 1.6 }}>
                    {desc}
                </Typography>
            </CardContent>
        </Card>
    );
}

const chipStyle = {
    bgcolor: "rgba(15,23,42,0.04)",
    border: "1px solid rgba(15,23,42,0.10)",
    fontWeight: 800,
};

const primaryBtn = {
    py: 1.6,
    px: 2.4,
    borderRadius: "16px",
    fontWeight: 900,
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    boxShadow: "0 16px 40px rgba(37,99,235,0.18)",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 20px 50px rgba(37,99,235,0.24)",
    },
    transition: "all .18s ease",
};

const secondaryBtn = {
    py: 1.6,
    px: 2.4,
    borderRadius: "16px",
    fontWeight: 900,
    borderWidth: "1.5px",
    "&:hover": { borderWidth: "1.5px", transform: "translateY(-2px)" },
    transition: "all .18s ease",
};
