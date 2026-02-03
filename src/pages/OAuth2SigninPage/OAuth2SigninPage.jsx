import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import { SiNaver } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";

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

    const handleGoogleLogin = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };

    const handleNaverLogin = () => {
        window.location.href =
            "http://localhost:8080/oauth2/authorization/naver";
    };

    return (
        <Container
            sx={{
                height: "90%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
            {/* <Box
                maxWidth="sm"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    mb: 5,
                }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        mb: 2,
                        wordBreak: "keep-all",
                        lineHeight: 1.3,
                    }}>
                    Route In에 오신 것을 환영합니다
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: "text.secondary",
                        wordBreak: "keep-all",
                    }}>
                    러닝 코스와 운동 루틴을 공유하고 추천받으세요
                </Typography>
            </Box> */}

            <Typography
                variant="h5"
                align="center"
                sx={{ mb: 4, fontWeight: 500 }}>
                로그인
            </Typography>

            <Stack spacing={2} sx={{ width: "320px" }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    startIcon={<FcGoogle />}
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
                    startIcon={<SiNaver />}
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
        </Container>
    );
};

export default OAuth2SigninPage;
