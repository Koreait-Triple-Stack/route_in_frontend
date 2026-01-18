import React from "react";
import { Container, Typography, Box, Paper, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ScheduleItem from "../../components/ScheduleItem";
import { usePrincipalState } from "../../store/usePrincipalState";
import { addRoutineRequest, getRoutineRequest, updateRoutineRequest, removeRoutineRequest, deleteRoutineByRoutineIdRequest } from "../../apis/routine/routineApi";

const MainPage = () => {
    const dbDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayMap = {
        monday: "월", tuesday: "화", wednesday: "수", thursday: "목", friday: "금", saturday: "토", sunday: "일"
    };

    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();

    const { data: response, isLoading } = useQuery({
        queryKey: ["getRoutine", principal?.userId],
        queryFn: () => getRoutineRequest(principal?.userId),
        staleTime: 30000,
        enabled: !!principal?.userId
    });

    const respData = response?.data.data || [];

    const addMutation = useMutation({
        mutationFn: addRoutineRequest,
        onSuccess: () => queryClient.invalidateQueries(["getRoutine", principal?.userId])
    });

    const updateMutation = useMutation({
        mutationFn: updateRoutineRequest,
        onSuccess: () => queryClient.invalidateQueries(["getRoutine", principal?.userId])
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRoutineByRoutineIdRequest, 
        onSuccess: () => queryClient.invalidateQueries(["getRoutine", principal?.userId])
    });

    const resetMutation = useMutation({
        mutationFn: removeRoutineRequest,
        onSuccess: () => queryClient.invalidateQueries(["getRoutine", principal?.userId])
    });

    const handleReset = (day) => { 
        const data = {
            userId: principal.userId,
            weekday: day
        };
        resetMutation.mutate(data);
    };

    const handleToggle = (routine) => {
        updateMutation.mutate({
            ...routine,
            checked: routine.checked ? 0 : 1,
        });
    };

    const handleSave = (day, finalRoutines, originalRoutines) => {
        const finalIds = finalRoutines.map(r => r.routineId).filter(id => id !== null);
        const toDelete = originalRoutines.filter(r => !finalIds.includes(r.routineId));

        const toAdd = finalRoutines.filter(r => r.routineId === null);

        toDelete.forEach(r => deleteMutation.mutate(r.routineId));
        
        toAdd.forEach(r => {
            addMutation.mutate({
                userId: principal.userId,
                weekday: day,
                exercise: r.exercise,
                checked: 0
            });
        });
    };

    if (isLoading) return <div>로딩중...</div>;

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Paper sx={{ p: 3, bgcolor: "primary.main", color: "white", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">안녕하세요, {principal?.username}님!</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>오늘도 힘내서 득근하세요! 💪</Typography>
            </Paper>

            <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: "primary.main", pb: 1, borderBottom: "2px solid #eee" }}>
                    <CalendarMonthIcon />
                    <Typography variant="subtitle1" fontWeight="bold">이번 주 스케줄</Typography>
                </Stack>

                <Stack spacing={2}>
                    {dbDays.map((day) => {
                        const dayRoutines = respData.filter((r) => r.weekday === day);
                        return (
                            <ScheduleItem
                                key={day}
                                day={dayMap[day]} 
                                routines={dayRoutines}
                                active={dayRoutines.length > 0}
                                onToggle={handleToggle}
                                onReset={() => handleReset(day)}
                                onSave={(finalRoutines) => handleSave(day, finalRoutines, dayRoutines)}
                            />
                        );
                    })}
                </Stack>
            </Box>
        </Container>
    );
};

export default MainPage;

