import {
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { usePrincipalState } from "../../store/usePrincipalState";
import SigninDialog from "./SigninDialog";
import { useEffect, useState } from "react";
import PreviewCard from "./PreviewCard";
import FeatureMini from "./FeatureMini";

export default function LandingPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = usePrincipalState();
    const [openDialog, setOpenDialog] = useState();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/main");
        }
    }, [isLoggedIn]);

    return (
        <Container sx={{ py: { xs: 4, md: 6 } }}>
            <Grid container spacing={4} alignItems="center">
                <Grid>
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
                                onClick={() => setOpenDialog(true)}
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={{
                                    py: 1.6,
                                    px: 2.4,
                                    borderRadius: "16px",
                                    fontWeight: 900,
                                    background:
                                        "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                    boxShadow:
                                        "0 16px 40px rgba(37,99,235,0.18)",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow:
                                            "0 20px 50px rgba(37,99,235,0.24)",
                                    },
                                    transition: "all .18s ease",
                                }}>
                                로그인하고 시작
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid>
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

            <SigninDialog
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
        </Container>
    );
}

const chipStyle = {
    bgcolor: "rgba(15,23,42,0.04)",
    border: "1px solid rgba(15,23,42,0.10)",
    fontWeight: 800,
};
