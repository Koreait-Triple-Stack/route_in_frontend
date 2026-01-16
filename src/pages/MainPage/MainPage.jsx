import React from "react";
import { Container, Typography, Box, Paper, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScheduleItem from "../../components/ScheduleItem";
import { usePrincipalState } from "../../store/usePrincipalState";
import { addRoutineRequest, getRoutineRequest, updateRoutineRequest } from "../../apis/routine/routineApi";
import { data } from "react-router-dom";

const MainPage = () => {
    const dbDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();

    const {
        data: response,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["getRoutine", principal?.userId],
        queryFn: () => getRoutineRequest(principal?.userId),
        staleTime: 30000,
    });

    const respData = response?.data.data || [];

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            return await updateRoutineRequest(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["getRoutine", principal?.userId]);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const addMutation = useMutation({
        mutationFn: async (data) => {
            return await addRoutineRequest(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["getRoutine", principal?.userId]);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleUpdate = (day, newTexts, originRoutine) => {
        const exerciseString = newTexts;
        updateMutation.mutate({
            routineId: originRoutine.routineId,
            userId: principal.userId,
            weekday: day,
            exercise: exerciseString,
            checked: 0,
        });
    };

    const handleDelete = () => {
        
    }

    const handleAdd = (day, newText) => {
        const exerciseString = newText;
        addMutation.mutate({
            userId: principal.userId,
            weekday: day,
            exercise: exerciseString,
            checked: 0,
        });
    };

    const handleToggle = (getWeekday) => {
        updateMutation.mutate({
            routineId: getWeekday.routineId,
            userId: principal.userId,
            weekday: getWeekday.weekday,
            exercise: getWeekday.exercise,
            checked: getWeekday.checked ? 0 : 1,
        });
    };

    if (isLoading) return <div>로딩중</div>;
    if (error) return <div>error.message</div>;

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
                        const dayRoutines = respData.filter((r) => r.weekday === day);
                        const originRoutine = dayRoutines[0];
                        return (
                            <ScheduleItem
                                key={day}
                                day={day}
                                routines={dayRoutines}
                                active={dayRoutines.length > 0}
                                onUpdate={(newTexts) => handleUpdate(day, newTexts, originRoutine)}
                                onReset={() => handleUpdate(day, [], originRoutine)}
                                onToggle={handleToggle}
                                onAdd={(newText) => handleAdd(day, newText)}
                            />
                        );
                    })}
                </Stack>
            </Box>
        </Container>
    );
};

export default MainPage;
