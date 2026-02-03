import {
    Avatar,
    Chip,
    ListItem,
    ListItemButton,
    Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { timeAgo } from "../../apis/utils/time";
import { boardTagChipSx, recommendChipSx } from "../../constants/design";
import { boardCardSx } from "../../constants/design";
function PostCard({ board }) {
    const year = new Date().getFullYear();
    const navigate = useNavigate();

    return (
        <>
            <ListItem sx={{ px: 0, mb: 1 }}>
                <ListItemButton
                    onClick={() => navigate(`/board/detail/${board.boardId}`)}
                    sx={boardCardSx}
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
                                    sx={boardTagChipSx(board.type)}
                                />
                                <Chip
                                    size="small"
                                    icon={<FavoriteIcon />}
                                    label={`추천 ${board.recommendCnt}`}
                                    sx={recommendChipSx}
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
                                        sx={boardTagChipSx(board.type)}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                    label={board.tags[0]}
                                    size="small"
                                    sx={boardTagChipSx(board.type)}
                                />
                                <Chip
                                    label={`${Math.round((board.tags[1] ?? 0) / 100) / 10} km`}
                                    size="small"
                                    sx={boardTagChipSx(board.type)}
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
