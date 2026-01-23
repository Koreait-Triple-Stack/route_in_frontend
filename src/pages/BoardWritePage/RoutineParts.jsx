import { Paper, ToggleButton, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { EXERCISE_PARTS } from "../../constants/exerciseParts";
import ScheduleItem from "./ScheduleItem";

function RoutineParts({ form, setForm, setRoutine }) {
    const togglePart = (part) => {
        setForm((prev) => {
            const nextParts = prev.tags?.includes(part) ? prev.parts.filter((t) => t !== part) : [...prev.parts, part];

            return { ...prev, parts: nextParts };
        });
    };
    const dbDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
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
        <Box>
            <Stack spacing={1.2}>
                <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: 14,
                        }}
                    >
                        운동 부위
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "text.secondary",
                        }}
                    >
                        복수 선택 가능
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    {EXERCISE_PARTS.map((part) => {
                        const selected = form.parts.includes(part);
                        return (
                            <ToggleButton
                                key={part}
                                value={part}
                                selected={selected}
                                onClick={() => togglePart(part)}
                                sx={{
                                    borderRadius: 999,
                                    px: 1.5,
                                    py: 0.7,
                                    fontWeight: 800,
                                    fontSize: 13,
                                }}
                            >
                                {part}
                            </ToggleButton>
                        );
                    })}
                </Box>
                <Stack spacing={2}>
                    {dbDays.map((day) => {
                        const dayRoutines = form.routines.filter((r) => r.weekday === day);
                        return (
                            <ScheduleItem
                                key={day}
                                dayEng={day}
                                day={dayMap[day]}
                                routines={dayRoutines}
                                onSave={(localRoutine) => setRoutine(day, localRoutine)}
                                onReset={() => setRoutine(day, [])}
                            />
                        );
                    })}
                </Stack>
            </Stack>
        </Box>
    );
}

export default RoutineParts;
