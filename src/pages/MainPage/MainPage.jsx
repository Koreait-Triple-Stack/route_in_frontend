import React from "react";
import { Container, Typography, Box, Paper, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RoutineList from "./RoutineList";
import { usePrincipalState } from "../../store/usePrincipalState";
import CourseDetail from "./CourseDetail";
import { useQuery } from "@tanstack/react-query";
import { getCourseFavoriteByUserId } from "../../apis/course/courseService";
import Loading from "../../components/Loading";

const MainPage = () => {
    const { principal } = usePrincipalState();

    const { data: response, isLoading } = useQuery({
        queryKey: ["getCourseFavoriteByUserId", principal?.userId],
        queryFn: () => getCourseFavoriteByUserId(principal?.userId),
        staleTime: 30000,
        enabled: !!principal?.userId,
    });

    if (isLoading) return <Loading />;

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
                </Stack>

                <RoutineList userId={principal?.userId} />

                <CourseDetail course={response?.data} />
            </Stack>
        </Container>
    );
};

export default MainPage;
