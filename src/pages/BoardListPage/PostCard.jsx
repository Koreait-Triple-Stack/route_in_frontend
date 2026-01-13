import { Avatar, Chip, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";

function PostCard({ post }) {
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
                    <Chip label={post.category} size="small" />
                    <Typography variant="caption" color="text.secondary">
                        {post.date}
                    </Typography>
                </Box>

                <Typography fontWeight={700}>{post.title}</Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2">
                        {post.author} · {post.age}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {post.meta.map((m, i) => (
                        <Chip key={i} label={m} size="small" />
                    ))}
                </Stack>
            </Stack>
        </Paper>
    );
}

export default PostCard;
