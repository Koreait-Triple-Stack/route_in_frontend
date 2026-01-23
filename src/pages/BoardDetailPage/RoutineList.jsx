import { useQuery } from "@tanstack/react-query";
import { Box, Stack } from "@mui/system";
import { getRoutine } from "../../apis/routine/routineService";
import Loading from "../../components/Loading";
import { Chip, Paper, Typography } from "@mui/material";

function RoutineList({ routines }) {
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

    return (
        <Box sx={{ p: 1 }}>
            <Stack spacing={2}>
                {dbDays.map((day) => {
                    const dayRoutines = routines.filter(
                        (r) => r.weekday.toLowerCase() === day.toLowerCase(),
                    );
                    return (
                        <Paper
                            key={day}
                            variant="outlined"
                            sx={{
                                p: 2,
                                bgcolor: dayRoutines > 0 ? "#f0f7ff" : "white",
                                borderColor:
                                    dayRoutines > 0
                                        ? "primary.light"
                                        : "grey.300",
                            }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 2,
                                }}>
                                <Box width={50}>
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        color="text.primary">
                                        {dayMap[day]}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                        }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 1,
                                            }}>
                                            {dayRoutines.map(
                                                (routine, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={routine.exercise}
                                                        variant="caption"
                                                        sx={{
                                                            bgcolor:
                                                                "primary.main",
                                                            color: "white",
                                                        }}
                                                    />
                                                ),
                                            )}
                                            {dayRoutines.length === 0 && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary">
                                                    등록된 운동이 없습니다.
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    );
                })}
            </Stack>
        </Box>
    );
}

export default RoutineList;
