import React from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    AppBar,
    Toolbar,
    IconButton,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    const NAV_H = "56";

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: `${NAV_H}px`, // ✅ 네비 높이만큼 제외
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                bgcolor: "background.default",
            }}>
            <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 500 }}>
                {/* 2. 중앙 컨텐츠 영역 */}
                <Box
                    maxWidth="sm"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        pb: 10, // 하단 여백을 주어 시각적 안정감 부여
                    }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            wordBreak: "keep-all", // 한글 단어 단위 줄바꿈
                            lineHeight: 1.3,
                        }}>
                        Route In에 오신 것을 환영합니다
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "text.secondary",
                            mb: 6,
                            wordBreak: "keep-all",
                        }}>
                        러닝 코스와 운동 루틴을 공유하고 추천받으세요
                    </Typography>

                    {/* 3. 버튼 그룹 */}
                    <Stack
                        spacing={2}
                        sx={{ width: "100%", maxWidth: "320px" }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                py: 1.8,
                                borderRadius: "12px",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                bgcolor: "#2563eb",
                                "&:hover": { bgcolor: "#1d4ed8" },
                            }}
                            onClick={() => navigate("/oauth2/signin")}>
                            로그인
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            sx={{
                                py: 1.8,
                                borderRadius: "12px",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                borderWidth: "1.5px",
                                "&:hover": { borderWidth: "1.5px" },
                            }}
                            onClick={() => navigate("/oauth2/signup")}>
                            회원가입
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default LandingPage;
