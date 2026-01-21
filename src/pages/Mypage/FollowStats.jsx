import { Box, Divider, Stack, Typography } from "@mui/material";

export default function FollowStats({
    followerCnt = 0,
    followingCnt = 0,
    onFollower,
    onFollowing,
}) {
    const chipBtn = {
        all: "unset",
        cursor: "pointer",
    };

    return (
        <Box sx={{ px: 2, py: 1.25 }}>
            {/* 테두리 박스는 '그냥 레이아웃' */}
            <Box
                sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    px: 2,
                    py: 1.25,
                }}>
                {/* 클릭 가능한 건 가운데 2개 블록만 */}
                <Stack
                    direction="row"
                    divider={<Divider flexItem />}
                    sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}>
                    <Box
                        component="button"
                        onClick={onFollower}
                        style={chipBtn}>
                        <Box
                            sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                                "&:active": { opacity: 0.7 },
                                textAlign: "center",
                            }}>
                            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                                {followerCnt}
                            </Typography>
                            <Typography
                                sx={{ fontSize: 12, color: "text.secondary" }}>
                                팔로워
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        component="button"
                        onClick={onFollowing}
                        style={chipBtn}>
                        <Box
                            sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                                "&:active": { opacity: 0.7 },
                                textAlign: "center",
                            }}>
                            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                                {followingCnt}
                            </Typography>
                            <Typography
                                sx={{ fontSize: 12, color: "text.secondary" }}>
                                팔로잉
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
