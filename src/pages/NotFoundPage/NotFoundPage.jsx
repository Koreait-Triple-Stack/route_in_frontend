import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Stack,
    Divider,
} from "@mui/material";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                // minHeight: "100svh",
                display: "flex",
                alignItems: "center",
                bgcolor: "background.default",
            }}>
            <Container maxWidth="sm" sx={{ py: 5 }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        p: { xs: 3, sm: 4 },
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        bgcolor: "#F7FAFF",
                    }}>
                    {/* 배경 포인트 원 */}
                    <Box
                        sx={{
                            position: "absolute",
                            width: 220,
                            height: 220,
                            borderRadius: "50%",
                            bgcolor: "rgba(25, 118, 210, 0.08)",
                            top: -90,
                            left: -90,
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            width: 260,
                            height: 260,
                            borderRadius: "50%",
                            bgcolor: "rgba(25, 118, 210, 0.06)",
                            bottom: -120,
                            right: -120,
                        }}
                    />

                    <Stack
                        spacing={2.2}
                        alignItems="center"
                        sx={{ position: "relative" }}>
                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: 999,
                                display: "grid",
                                placeItems: "center",
                                bgcolor: "rgba(25, 118, 210, 0.12)",
                            }}>
                            <SentimentDissatisfiedOutlinedIcon
                                sx={{ fontSize: 34 }}
                            />
                        </Box>

                        <Typography
                            variant="overline"
                            sx={{
                                letterSpacing: 1.4,
                                color: "text.secondary",
                            }}>
                            NOT FOUND
                        </Typography>

                        <Typography
                            variant="h3"
                            sx={{ fontWeight: 800, letterSpacing: -0.6 }}>
                            404
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, letterSpacing: -0.2 }}>
                            페이지를 찾을 수 없어요
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}>
                            요청하신 주소가 변경되었거나 삭제되었을 수 있어요.
                            <br />
                            아래 버튼을 통해 홈으로 이동하거나 이전 페이지로
                            돌아가주세요.
                        </Typography>

                        <Divider flexItem sx={{ my: 1 }} />

                        <Stack
                            direction="row"
                            spacing={1.2}
                            sx={{ width: "100%" }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ArrowBackRoundedIcon />}
                                onClick={() => navigate(-1)}
                                sx={{
                                    borderRadius: 2.5,
                                    py: 1.2,
                                    fontWeight: 700,
                                }}>
                                뒤로가기
                            </Button>

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<HomeRoundedIcon />}
                                onClick={() => navigate("/")}
                                sx={{
                                    borderRadius: 2.5,
                                    py: 1.2,
                                    fontWeight: 800,
                                }}>
                                홈으로
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 2,
                        color: "text.secondary",
                    }}>
                    문제가 계속되면 관리자에게 문의해주세요.
                </Typography>
            </Container>
        </Box>
    );
}

export default NotFoundPage;
