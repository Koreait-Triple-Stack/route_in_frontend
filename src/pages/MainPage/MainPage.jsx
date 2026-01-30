import { Container, Typography, Box, Paper, Stack, List, ListItemButton, ListItemText, Collapse, Button, Divider } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RoutineList from "./RoutineList";
import { usePrincipalState } from "../../store/usePrincipalState";
import CourseDetail from "./CourseDetail";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import RunningRecord from "./RunningRecord";
import AIRecommend from "./AIRecommend";
import OncePerDay from "../../hooks/OncePerDay";
import Calendar from "../../components/Calendar";

const MainPage = () => {
    const { principal } = usePrincipalState();
    const [routineOpen, setRoutineOpen] = useState(false);
    const [runningOpen, setRunningOpen] = useState(false);

    const handleRoutine = () => setRoutineOpen(!routineOpen);
    const handleRunning = () => setRunningOpen(!runningOpen);

    const { open, close } = OncePerDay(principal?.userId);
    return (
        <Container>
            <Stack spacing={2}>
                <Paper sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
                    <Typography variant="h6" fontWeight="bold">
                        안녕하세요, {principal?.username}님!
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        오늘도 힘내서 득근하세요! 💪
                    </Typography>
                </Paper>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                        mb: 2,
                        color: "primary.main",
                        pb: 1,
                        borderBottom: "2px solid #eee",
                    }}
                >
                    <CalendarMonthIcon />
                    <Typography variant="subtitle1" fontWeight="bold">
                        이번 주 스케줄
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                </Stack>

                <Stack spacing={2}>
                    <AIRecommend userId={principal?.userId} />
                    <Button onClick={handleRoutine}>
                        <Typography>운동루틴 수정</Typography>
                        {routineOpen ? <ExpandLess /> : <ExpandMore />}
                    </Button>
                    <Collapse in={routineOpen} timeout="auto" unmountOnExit>
                        <RoutineList userId={principal?.userId} />
                    </Collapse>

                    <Button onClick={handleRunning}>
                        <Typography>러닝기록</Typography>
                        {runningOpen ? <ExpandLess /> : <ExpandMore />}
                    </Button>
                    <Collapse in={runningOpen} timeout="auto" unmountOnExit>
                        <Stack spacing={2}>
                            <RunningRecord userId={principal?.userId} />
                            <CourseDetail />
                        </Stack>
                    </Collapse>
                </Stack>
            </Stack>
            <Calendar open={open} onClose={close} lockCurrentMonth />
        </Container>
    );
};

export default MainPage;
