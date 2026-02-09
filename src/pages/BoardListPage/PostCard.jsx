import {
    Avatar,
    Chip,
    Divider,
    ListItem,
    ListItemButton,
    Typography,
} from "@mui/material";
import { Box, Grid, Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { timeAgo } from "../../apis/utils/time";
import { glassCardSx, chipBaseSx } from "../../constants/boardDesign";

function PostCard({ board }) {
    const year = new Date().getFullYear();
    const navigate = useNavigate();

    return (
        <>
            <ListItem sx={{ px: 0, mb: 1 }}>
                <ListItemButton
                    onClick={() => navigate(`/board/detail/${board.boardId}`)}
                    sx={{ ...glassCardSx, px: 2, py: 1.8 }}>
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
                                    sx={{
                                        ...chipBaseSx,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        ...(board.type === "COURSE"
                                            ? {
                                                  color: "primary.dark",
                                                  bgcolor:
                                                      "rgba(59,130,246,0.10)",
                                              }
                                            : {
                                                  color: "secondary.dark",
                                                  bgcolor:
                                                      "rgba(168,85,247,0.10)",
                                              }),
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.4,
                                        px: 0.9,
                                        height: 24,
                                        borderRadius: 999,
                                        bgcolor: "rgba(245,158,11,0.14)",
                                        border: "1px solid rgba(245,158,11,0.30)",
                                    }}>
                                    <FavoriteIcon
                                        sx={{
                                            fontSize: 14,
                                            color: "error.main",
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: 12.5,
                                            fontWeight: 800,
                                            color: "warning.dark",
                                            lineHeight: 1,
                                        }}>
                                        {board.recommendCnt}
                                    </Typography>
                                </Box>
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
                                pl: 0.2,
                                fontWeight: 950,
                                letterSpacing: "-0.02em",
                                whiteSpace: "normal",
                                wordBreak: "keep-all",
                                overflowWrap: "anywhere",
                                lineHeight: 1.25,
                            }}>
                            {board.title}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                                sx={{
                                    width: 34,
                                    height: 34,
                                    border: "2px solid rgba(255,255,255,0.9)",
                                    boxShadow: "0 6px 16px rgba(15,23,42,0.12)",
                                }}
                                src={board.profileImg}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: "-0.01em",
                                }}>
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
                                        sx={{
                                            ...chipBaseSx,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            bgcolor: "transparent",
                                        }}
                                    />
                                ))}
                            </Grid>
                        ) : (
                            <Grid container spacing={1}>
                                <Chip
                                    label={board.tags[0]}
                                    size="small"
                                    sx={{
                                        ...chipBaseSx,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: "transparent",
                                    }}
                                />
                                <Chip
                                    label={`${Math.round((board.tags[1] ?? 0) / 100) / 10} km`}
                                    size="small"
                                    sx={{
                                        ...chipBaseSx,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: "transparent",
                                    }}
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
