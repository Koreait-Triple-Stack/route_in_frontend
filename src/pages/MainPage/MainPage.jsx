import React from "react";
import { Container, Typography, Box, Paper, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScheduleItem from "../../components/ScheduleItem";
import { usePrincipalState } from "../../store/usePrincipalState";
import { getRoutineRequest, updateRoutineRequest } from "../../apis/routine/routineApi";
import { data } from "react-router-dom";

const MainPage = () => {
    const dbDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();
    const userId = principal?.userId;

    const { data } = useQuery({
        queryKey: ["getRoutine", userId],
        queryFn: () => getRoutineRequest(userId),
        enabled: !!principal,
    });

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            return await updateRoutineRequest(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["getRoutine"]);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleUpdate = (day, newTexts) => {
        const exerciseString = newTexts.join(", ");

        updateMutation.mutate({
            routineId: data?.data[dbDays.indexOf(day)]?.routineId,
            userId: principal.userId,
            weekday: day,
            exercise: exerciseString,
            checked: 0,
        });
    };

    const handleToggle = (day) => {
        // const aa = (dayStr) => data?.data?.find((r) => r.day === dayStr);
        updateMutation.mutate({
            userId: principal.userId,
            weekday: data?.data[dbDays.indexOf(day)]?.weekday,
            exercise: "aaa",
            checked: data?.data[dbDays.indexOf(day)]?.checked ? 0 : 1,
        });
    };

    const getOriginRoutine = (dayStr) => data?.data?.find((r) => r.day === dayStr);
    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Paper sx={{ p: 3, bgcolor: "primary.main", color: "white", mb: 3 }}>
                <Typography variant="h5">안녕하세요, {principal?.username}님!</Typography>
                <Typography variant="body1">오늘도 함께 운동해요 💪</Typography>
            </Paper>

            <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: "primary.main", width: 557 }}>
                    <CalendarMonthIcon />
                    <Typography variant="subtitle1">이번 주 스케줄</Typography>
                </Stack>

                <Stack spacing={1.5}>
                    {dbDays.map((day) => {
                        const originRoutine = getOriginRoutine(day);
                        return (
                            <ScheduleItem
                                key={day}
                                day={day}
                                routines={data?.data?.filter((r) => r.weekday === day)}
                                active={data?.data.length > 0}
                                onUpdate={(newTexts) => handleUpdate(day, newTexts, originRoutine)}
                                onReset={() => handleUpdate(day, [], originRoutine)}
                                onToggle={() => handleToggle(dbDays.indexOf(day))}
                            />
                        );
                    })}
                </Stack>
            </Box>
        </Container>
    );
};

export default MainPage;
