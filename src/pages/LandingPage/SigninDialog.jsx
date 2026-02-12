import { Button, Dialog, IconButton, Typography, Divider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import CloseIcon from "@mui/icons-material/Close";

function SigninDialog({ openDialog, setOpenDialog }) {
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
    };

    const handleNaverLogin = () => { 
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/naver`;
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                },
            }}>
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Typography fontWeight={700}>로그인</Typography>

                <IconButton onClick={() => setOpenDialog(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            <Box sx={{ p: 4 }}>
                <Typography
                    align="center"
                    sx={{
                        mb: 0.5,
                        fontWeight: 600,
                        fontSize: 20,
                    }}>
                    환영합니다 👋
                </Typography>

                <Typography
                    align="center"
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}>
                    소셜 계정으로 간편하게 시작하세요
                </Typography>

                <Stack spacing={2}>
                    <Button
                        fullWidth
                        onClick={handleGoogleLogin}
                        startIcon={<FcGoogle />}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            border: "1px solid #e0e0e0",
                            color: "text.primary",
                            bgcolor: "#fff",
                            fontWeight: 500,
                            "&:hover": {
                                bgcolor: "#fafafa",
                                transform: "translateY(-1px)",
                            },
                            textTransform: "none",
                            transition: "0.2s",
                        }}>
                        Google로 로그인
                    </Button>

                    <Button
                        fullWidth
                        onClick={handleNaverLogin}
                        startIcon={<SiNaver />}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            bgcolor: "#03c75a",
                            color: "#fff",
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": {
                                bgcolor: "#02b350",
                                transform: "translateY(-1px)",
                                boxShadow: "none",
                            },
                            transition: "0.2s",
                        }}>
                        네이버로 로그인
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
}

export default SigninDialog;
