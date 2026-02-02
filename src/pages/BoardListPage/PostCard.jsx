import {
    Avatar,
    Chip,
    Divider,
    ListItem,
    ListItemButton,
    Paper,
    Typography,
} from "@mui/material";
import { borderColor, Box, Stack } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { timeAgo } from "../../apis/utils/time";

function PostCard({ board }) {
    const year = new Date().getFullYear();
    const navigate = useNavigate();
    const tagSx = {
        color: board.type === "COURSE" ? "primary.dark" : "white",
        bgcolor: board.type === "COURSE" ? "transparent" : "primary.main",
        border: "1px solid",
        borderColor: board.type === "COURSE" ? "primary.dark" : "transparent",
    };

    return (
        <>
            <ListItem sx={{px: 0}}>
                <ListItemButton
                    sx={{ borderRadius: 3, px: 1}}
                    onClick={() => navigate(`/board/detail/${board.boardId}`)}>
                    <Stack sx={{width:"100%"}} spacing={1.5}>
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
                                    sx={tagSx}
                                />
                                <Chip
                                    size="small"
                                    icon={<FavoriteIcon />}
                                    label={`추천 ${board.recommendCnt}`}
                                    sx={{
                                        px: 0.8,
                                        bgcolor: "transparent",
                                        borderRadius: "999px",

                                        "& .MuiChip-icon": {
                                            fontSize: 18,
                                            color: "#ff4d4f", // 하트 색
                                            ml: 0.5,
                                        },

                                        "& .MuiChip-label": {
                                            fontSize: 13,
                                            fontWeight: 900,
                                            px: 1,
                                            color: "text.primary",
                                        },
                                    }}
                                />
                            </Stack>
                            <Typography
                                variant="caption"
                                color="text.secondary">
                                {timeAgo(board.createDt)}
                            </Typography>
                        </Box>

                        <Typography fontWeight={700} sx={{pl: 0.3}}>{board.title}</Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                                sx={{ width: 32, height: 32 }}
                                src={board.profileImg}
                            />
                            <Typography variant="body2">
                                {board.username} ·{" "}
                                {Math.floor(
                                    (year - board.birthDate.split("-")[0] + 1) /
                                        10,
                                ) * 10}
                                대
                            </Typography>
                        </Stack>

                        {board.type === "ROUTINE" ? (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {board.tags.map((m, i) => (
                                    <Chip
                                        key={i}
                                        label={m}
                                        size="small"
                                        sx={tagSx}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                    label={board.tags[0]}
                                    size="small"
                                    sx={tagSx}
                                />
                                <Chip
                                    label={`${Math.round((board.tags[1] ?? 0) / 100) / 10} km`}
                                    size="small"
                                    sx={tagSx}
                                />
                            </Stack>
                        )}
                    </Stack>
                </ListItemButton>
            </ListItem>

            <Divider variant="middle" />
        </>
    );
}

export default PostCard;
