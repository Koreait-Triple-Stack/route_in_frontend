import { Container, Typography, Box, Paper, Stack, Collapse, IconButton, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { usePrincipalState } from "../../store/usePrincipalState";
import RoutineList from "./RoutineList";
import CourseDetail from "./CourseDetail";
import RunningRecord from "./RunningRecord";
import AIRecommend from "./AIRecommend";
import OncePerDay from "../../hooks/OncePerDay";
import Calendar from "../../components/Calendar";
import Weather from "./Weather";
import { alignItems, display, justifyContent } from "@mui/system";

const MainPage = () => {
    const { principal } = usePrincipalState();
    const [routineOpen, setRoutineOpen] = useState(false);
    const [runningOpen, setRunningOpen] = useState(false);
    const { open, close } = OncePerDay(principal?.userId);

    const THEME = {
        bg: "#F0F4F8",
        paper: "#FFFFFF",
        accent: "#007AFF",
        point: "#5856D6", // 퍼플 블루
    };

    const moduleStyle = {
        px: 2.5, // 좌우 여백
        py: 1.5, // 상하 여백 (높이가 너무 높지 않게 조정)
        borderRadius: "20px", // 너무 둥글기보다 적당한 곡률이 더 깔끔함
        background: "#FFFFFF",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        border: "1px solid #F1F5F9",
        display: "flex",
        flexDirection: "column",
        width: "100%",
    };

    return (
        <Box
            sx={{
                bgcolor: THEME.bg,
                minHeight: "100vh",
                pb: 8,
                color: "#1D1D1F", // Apple 스타일의 짙은 회색 텍스트
                fontFamily: "'Pretendard', sans-serif",
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={4} sx={{ pt: 4 }}>
                    {/* 1. 상단 프로필 (깔끔한 타이포그래피) */}
                    <Box sx={{ px: 1 }}>
                        <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: "-1px", color: "#1D1D1F" }}>
                            Hello, <span style={{ color: THEME.accent }}>{principal?.username}</span>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5, opacity: 0.6, fontWeight: 500 }}>
                            오늘은 러닝하기 딱 좋은 날씨네요! 🏃‍♂️
                        </Typography>
                    </Box>

                    {/* 2. 날씨 섹션 (화이트 플로팅 카드) */}
                    <Paper
                        sx={{
                            ...moduleStyle,
                            p: 2,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            bgcolor: "rgba(255, 255, 255, 0.8)",
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: THEME?.softBlue || "#E3F2FD",
                                p: 1,
                                borderRadius: "14px",
                                mr: 2,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <CalendarMonthIcon sx={{ color: THEME.accent }} />
                        </Box>
                        <Typography fontWeight="700" color="#424245">
                            WEEKLY PLAN
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Weather />
                    </Paper>

                    {/* 3. AI 추천 섹션 (부드러운 컬러 강조) */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ ml: 2, mb: 1, color: THEME.accent, fontWeight: "800" }}>
                            AI 맞춤 코칭
                        </Typography>
                        <AIRecommend userId={principal?.userId} />
                    </Box>

                    <Stack spacing={1.5}>
                        {" "}
                        {/* 모듈 간 간격도 조금 좁혀서 콤팩트하게 */}
                        {/* 운동 루틴 섹션 */}
                        <Paper sx={moduleStyle}>
                            <Box
                                onClick={() => setRoutineOpen(!routineOpen)}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between", // 제목-왼쪽, 아이콘-오른쪽
                                    alignItems: "center",
                                    cursor: "pointer",
                                    width: "100%",
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    {/* 왼쪽 포인트 바 */}
                                    <Box sx={{ width: 3, height: 18, bgcolor: THEME.accent, borderRadius: 1 }} />
                                    <Typography variant="body1" fontWeight="700" sx={{ color: "#1D1D1F" }}>
                                        운동 루틴
                                    </Typography>
                                </Stack>

                                <IconButton size="small" sx={{ p: 0.5, color: "#C7C7CC" }}>
                                    {routineOpen ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Box>

                            <Collapse in={routineOpen}>
                                <Box sx={{ mt: 2 }}>
                                    {" "}
                                    {/* 펼쳐졌을 때만 여백 발생 */}
                                    <RoutineList userId={principal?.userId} />
                                </Box>
                            </Collapse>
                        </Paper>
                        {/* 러닝 기록 섹션 */}
                        <Paper sx={moduleStyle}>
                            <Box
                                onClick={() => setRunningOpen(!runningOpen)}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    width: "100%",
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box sx={{ width: 3, height: 18, bgcolor: THEME.point, borderRadius: 1 }} />
                                    <Typography variant="body1" fontWeight="700" sx={{ color: "#1D1D1F" }}>
                                        러닝 기록
                                    </Typography>
                                </Stack>

                                <IconButton size="small" sx={{ p: 0.5, color: "#C7C7CC" }}>
                                    {runningOpen ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Box>

                            <Collapse in={runningOpen}>
                                <Box sx={{ mt: 2 }}>
                                    <Stack spacing={2}>
                                        <RunningRecord userId={principal?.userId} />
                                        <CourseDetail />
                                    </Stack>
                                </Box>
                            </Collapse>
                        </Paper>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default MainPage;
