import {
    Avatar,
    Chip,
    Divider,
    ListItem,
    ListItemButton,
    Typography,
} from "@mui/material";
import { Box, Grid, Stack } from "@mui/system";
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
                    sx={boardCardSx}>
                    <Stack sx={{ width: "100%" }} spacing={1.5}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center">
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
                                textAlign={"end"}
                                minWidth={70}>
                                {timeAgo(board.createDt)}
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                flex: 1,
                                pl: 0.5,
                                fontWeight: 800,
                                whiteSpace: "normal",
                                overflow: "visible",
                                textOverflow: "clip",
                                wordBreak: "keep-all",
                                overflowWrap: "anywhere",
                                lineHeight: 1.25,
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
                                sx={{ fontWeight: 600 }}>
                                {board.username} ·{" "}
                                {Math.floor(
                                    (year - board.birthDate.split("-")[0] + 1) /
                                        10,
                                ) * 10}
                                대
                            </Typography>
                        </Stack>
                        <Divider />
                        {board.type === "ROUTINE" ? (
                            <Grid container spacing={1}>
                                {board.tags.map((m, i) => (
                                    <Chip
                                        key={i}
                                        label={m}
                                        size="small"
                                        sx={boardTagChipSx(board.type)}
                                    />
                                ))}
                            </Grid>
                        ) : (
                            <Grid container spacing={1}>
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
                            </Grid>
                        )}
                    </Stack>
                </ListItemButton>
            </ListItem>
        </>
    );
}

export default PostCard;
