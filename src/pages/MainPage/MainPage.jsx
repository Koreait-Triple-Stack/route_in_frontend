import {
    Container,
    Typography,
    Box,
    Paper,
    Stack,
    Button,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RoutineList from "./RoutineList";
import { usePrincipalState } from "../../store/usePrincipalState";
import CourseDetail from "./CourseDetail";
import AttendanceCalendarForm from "../../components/Calendar/AttendanceCalendarForm";
import { useState } from "react";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
const MainPage = () => {
    const { principal } = usePrincipalState();
    const [openCalendar, setOpenCalendar] = useState(true);
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
                    <Button
                        size="small"
                        startIcon={<CalendarTodayOutlinedIcon />}
                        onClick={() => setOpenCalendar(true)}
                    >
                        이번달 출석
                    </Button>
                </Stack>

                <RoutineList userId={principal?.userId} />
                <CourseDetail />
            </Stack>
            <AttendanceCalendarForm
                open={openCalendar}
                onClose={() => setOpenCalendar(false)}
            />
        </Container>
    );
};

export default MainPage;
