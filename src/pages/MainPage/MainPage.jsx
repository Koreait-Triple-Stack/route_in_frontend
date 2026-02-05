import {
    Container,
    Typography,
    Box,
    Paper,
    Stack,
    Collapse,
    IconButton,
    Chip,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { usePrincipalState } from "../../store/usePrincipalState";
import RoutineList from "./RoutineList";
import CourseDetail from "./CourseDetail";
import RunningRecord from "./RunningRecord";
import AIRecommend from "./AIRecommend";
import Calendar from "../../components/Calendar";
import { updateAttendancePopupShownToday } from "../../apis/attendance/attendanceService";
import Weather from "./Weather";
import { moduleStyle, THEME } from "../../constants/design";

const MainPage = () => {
    const { principal, AttendanceChecked } = usePrincipalState();
    const [routineOpen, setRoutineOpen] = useState(false);
    const [runningOpen, setRunningOpen] = useState(false);

    const handleClose = () => {
        AttendanceChecked();
        updateAttendancePopupShownToday().catch(() => {});
    };

    return (
        <Box
            sx={{
                color: "#1D1D1F",
                fontFamily: "'Pretendard', sans-serif",
            }}>
            <Container maxWidth="sm">
                <Stack spacing={4} sx={{ pt: 4 }}>
                    <Box sx={{ px: 1 }}>
                        <Typography
                            variant="h4"
                            fontWeight="800"
                            sx={{ letterSpacing: "-1px", color: "#1D1D1F" }}>
                            Hello,{" "}
                            <span style={{ color: THEME.accent }}>
                                {principal?.username}
                            </span>
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ mt: 0.5, opacity: 0.6, fontWeight: 500 }}>
                            오늘은 러닝하기 딱 좋은 날씨네요! 🏃‍♂️
                        </Typography>
                    </Box>

                    <Paper
                        sx={{
                            ...moduleStyle,
                            p: 2,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            bgcolor: "rgba(255, 255, 255, 0.8)",
                            border: "1px solid",
                            borderColor: "divider",
                        }}>
                        <Box
                            sx={{
                                bgcolor: THEME?.softBlue || "#E3F2FD",
                                p: 1,
                                borderRadius: "14px",
                                mr: 2,
                                display: "flex",
                                alignItems: "center",
                            }}>
                            <CalendarMonthIcon sx={{ color: THEME.accent }} />
                        </Box>
                        <Typography fontWeight="700" color="#424245">
                            WEEKLY PLAN
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Weather />
                    </Paper>

                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                ml: 2,
                                mb: 1,
                                color: THEME.accent,
                                fontWeight: "800",
                            }}>
                            AI 맞춤 코칭
                        </Typography>
                        <AIRecommend userId={principal?.userId} />
                    </Box>

                    <Stack spacing={1.5}>
                        <Paper
                            sx={{
                                ...moduleStyle,
                                border: "1px solid",
                                borderColor: "divider",
                            }}>
                            <Box
                                onClick={() => setRoutineOpen(!routineOpen)}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    width: "100%",
                                }}>
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center">
                                    <Box
                                        sx={{
                                            width: 3,
                                            height: 18,
                                            bgcolor: THEME.accent,
                                            borderRadius: 1,
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        fontWeight="700"
                                        sx={{ color: "#1D1D1F" }}>
                                        운동 루틴
                                    </Typography>
                                </Stack>

                                <IconButton
                                    size="small"
                                    sx={{ p: 0.5, color: "#C7C7CC" }}>
                                    {routineOpen ? (
                                        <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                    )}
                                </IconButton>
                            </Box>

                            <Collapse in={routineOpen}>
                                <Box sx={{ mt: 2 }}>
                                    <RoutineList userId={principal?.userId} />
                                </Box>
                            </Collapse>
                        </Paper>

                        <Paper
                            sx={{
                                ...moduleStyle,
                                border: "1px solid",
                                borderColor: "divider",
                            }}>
                            <Box
                                onClick={() => setRunningOpen(!runningOpen)}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    width: "100%",
                                }}>
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center">
                                    <Box
                                        sx={{
                                            width: 3,
                                            height: 18,
                                            bgcolor: THEME.point,
                                            borderRadius: 1,
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        fontWeight="700"
                                        sx={{ color: "#1D1D1F" }}>
                                        러닝 기록
                                    </Typography>
                                </Stack>

                                <IconButton
                                    size="small"
                                    sx={{ p: 0.5, color: "#C7C7CC" }}>
                                    {runningOpen ? (
                                        <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                    )}
                                </IconButton>
                            </Box>

                            <Collapse in={runningOpen}>
                                <Box sx={{ mt: 2 }}>
                                    <Stack spacing={2}>
                                        <RunningRecord
                                            userId={principal?.userId}
                                        />
                                        <CourseDetail />
                                    </Stack>
                                </Box>
                            </Collapse>
                        </Paper>
                    </Stack>
                </Stack>
                <Calendar
                    open={!!principal?.checked}
                    onClose={handleClose}
                    lockMonth
                />
            </Container>
        </Box>
    );
};

export default MainPage;
