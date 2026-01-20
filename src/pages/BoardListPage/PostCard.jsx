import { Avatar, Chip, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";

function PostCard({ board }) {
    const year = new Date().getFullYear();

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.2s ease",

                "&:hover": {
                    elevation: 4,
                    backgroundColor: "action.hover",
                    transform: "translateY(-2px)",
                },

                "&:active": {
                    transform: "scale(0.98)",
                },
            }}>
            <Stack spacing={1.5}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Stack direction="row" spacing={1}>
                        <Chip
                            label={
                                board.type === "COURSE"
                                    ? "러닝코스"
                                    : "운동루틴"
                            }
                            size="small"
                        />
                        <Chip label={`추천수 ${board.recommendCnt}`} size="small" />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        {board.createDt.split("T")[0]}
                    </Typography>
                </Box>

                <Typography fontWeight={700}>{board.title}</Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2">
                        {board.username} ·{" "}
                        {Math.floor(
                            (year - board.birthDate.split("-")[0] + 1) / 10,
                        ) * 10}
                        대
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {board.tags.map((m, i) => (
                        <Chip key={i} label={m} size="small" />
                    ))}
                </Stack>
            </Stack>
        </Paper>
    );
}

export default PostCard;
