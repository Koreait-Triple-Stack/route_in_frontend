import {
    Avatar,
    Chip,
    Divider,
    ListItem,
    ListItemButton,
    Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
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
           
            <ListItem sx={{ px: 0, mb: 1}}>
                <ListItemButton
                    onClick={() => navigate(`/board/detail/${board.boardId}`)}
                    sx={{
                        borderRadius: 3,
                        px: 2,
                        py: 2,
                        bgcolor: "background.paper",
                        boxShadow: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        transition:
                            "transform 120ms ease, box-shadow 120ms ease",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 3,
                        },
                    }}
                >
                    <Stack sx={{ width: "100%" }} spacing={1.5}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
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
                                        border: "1px solid",
                                        borderColor: "divider",

                                        "& .MuiChip-icon": {
                                            fontSize: 18,
                                            color: "#ff4d4f",
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
                                color="text.secondary"
                            >
                                {timeAgo(board.createDt)}
                            </Typography>
                        </Box>

                        {/* ✅ 제목/본문은 clamp로 리스트 가독성 */}
                        <Typography
                            sx={{
                                fontWeight: 800,
                                lineHeight: 1.25,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {board.title}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                                sx={{ width: 32, height: 32 }}
                                src={board.profileImg}
                            />
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                            >
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

           
        </>
    );
}

export default PostCard;
