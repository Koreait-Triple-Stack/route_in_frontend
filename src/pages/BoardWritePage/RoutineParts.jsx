import { ToggleButton, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { EXERCISE_PARTS } from "../../constants/exerciseParts";

function RoutineParts({form}) {
    const togglePart = (part) => {
        setForm((prev) => {
            const nextParts = prev.tags.includes(part)
                ? prev.parts.filter((t) => t !== part)
                : [...prev.parts, part];

            return { ...prev, parts: nextParts };
        });
    };

    return (
        <Box>
            <Stack spacing={1.2}>
                <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="space-between">
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: 14,
                        }}>
                        운동 부위
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "text.secondary",
                        }}>
                        복수 선택 가능
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                    }}>
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
                                }}>
                                {part}
                            </ToggleButton>
                        );
                    })}
                </Box>
            </Stack>
        </Box>
    );
}

export default RoutineParts;
