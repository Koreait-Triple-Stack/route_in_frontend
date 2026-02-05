import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Stack } from "@mui/system";
import ScheduleItem from "../../components/ScheduleItem";
import {
    getRoutine,
    removeRoutine,
    updateRoutine,
} from "../../apis/routine/routineService";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";

function RoutineList({ userId }) {
    const dbDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];
    const dayMap = {
        monday: "월",
        tuesday: "화",
        wednesday: "수",
        thursday: "목",
        friday: "금",
        saturday: "토",
        sunday: "일",
    };

    const queryClient = useQueryClient();

    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getRoutine", userId],
        queryFn: () => getRoutine(userId),
        staleTime: 30000,
        enabled: !!userId,
    });

    const respData = response?.data || [];

    const updateMutation = useMutation({
        mutationFn: updateRoutine,
        onSuccess: () => queryClient.invalidateQueries(["getRoutine", userId]),
        onError: (error) => {
            alert(error.message);
        },
    });

    const resetMutation = useMutation({
        mutationFn: removeRoutine,
        onSuccess: () => queryClient.invalidateQueries(["getRoutine", userId]),
        onError: (error) => {
            alert(error.message);
        },
    });

    const handleReset = (day) => {
        const data = {
            userId: userId,
            weekday: day,
        };
        resetMutation.mutate(data);
    };

    const handleSave = (localRoutines, dayRoutines) => {
        const finalIds = localRoutines
            .map((r) => r.routineId)
            .filter((id) => id !== null);
        const toDelete = dayRoutines.filter(
            (r) => !finalIds.includes(r.routineId),
        );
        const toAdd = localRoutines.filter((r) => r.routineId === null);
        const payload = {
            addRoutines: toAdd,
            deleteIds: toDelete.map((r) => r.routineId),
        };

        updateMutation.mutate(payload);
    };

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    return (
        <Box sx={{gap: 1}}>
            {dbDays.map((day) => {
                const dayRoutines = respData.filter(
                    (r) => r.weekday.toLowerCase() === day.toLowerCase(),
                );
                return (
                    <ScheduleItem
                        key={day}
                        day={dayMap[day]}
                        dayEng={day}
                        routines={dayRoutines}
                        active={dayRoutines.length > 0}
                        onReset={() => handleReset(day)}
                        onSave={(localRoutines) =>
                            handleSave(localRoutines, dayRoutines)
                        }
                    />
                );
            })}
        </Box>
    );
}

export default RoutineList;
