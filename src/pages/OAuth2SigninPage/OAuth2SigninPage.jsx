import React, { useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Stack,
} from "@mui/material";

const OAuth2SigninPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const accessToken = searchParams.get("accessToken");

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("AccessToken", accessToken);
            window.location.href = "/";
        }
    }, [accessToken]);

    // 소셜 로그인 버튼 핸들러
    const handleGoogleLogin = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };

    const handleNaverLogin = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/naver";
    };

    return (
        <Container>
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    width: "100%",
                    borderRadius: 4,
                    border: "1px solid #eee",
                    bgcolor: "white",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                }}>
                <Typography
                    variant="h5"
                    align="center"
                    sx={{ mb: 4, fontWeight: 500 }}>
                    로그인
                </Typography>

                <Stack spacing={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleGoogleLogin}
                        startIcon={
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor: "#ef4444",
                                }}
                            />
                        }
                        sx={{
                            py: 1.5,
                            borderColor: "#e0e0e0",
                            color: "text.primary",
                            bgcolor: "white",
                            borderRadius: 2,
                            "&:hover": {
                                bgcolor: "#f5f5f5",
                                borderColor: "#d0d0d0",
                            },
                        }}>
                        구글로 로그인
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleNaverLogin}
                        startIcon={
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor: "white",
                                }}
                            />
                        }
                        sx={{
                            py: 1.5,
                            bgcolor: "#03c75a",
                            color: "white",
                            borderRadius: 2,
                            boxShadow: "none",
                            "&:hover": {
                                bgcolor: "#02b350",
                                boxShadow: "none",
                            },
                        }}>
                        네이버로 로그인
                    </Button>
                </Stack>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        계정이 없으신가요?{" "}
                    </Typography>
                    <Typography
                        variant="body2"
                        component="span"
                        sx={{
                            color: "#2563eb",
                            fontWeight: "bold",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => navigate("/oauth2/signup")}>
                        회원가입
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default OAuth2SigninPage;
