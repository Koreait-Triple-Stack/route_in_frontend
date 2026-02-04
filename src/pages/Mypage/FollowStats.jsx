import { Box, Divider, Stack, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";

export default function FollowStats({
    followerCnt = 0,
    followingCnt = 0,
    onFollower,
    onFollowing,
    user
}) {
    const chipBtn = {
        all: "unset",
        cursor: "pointer",
    };

    return (
        <Box sx={{ px: 2, py: 1.25 }}>
            <Box
                sx={{
                    borderRadius: 2,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    px: 1,
                    py: 1.25,
                }}
            >
                <Stack
                    direction="row"
                    divider={<Divider flexItem />}
                    sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 4,
                    }}
                >
                    <ProfileHeader user={user} />
                    <Box component="button" onClick={onFollower} style={chipBtn}>
                        <Box
                            sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                                "&:active": { opacity: 0.7 },
                                textAlign: "center",
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#F8FAFC" }}>{followerCnt}</Typography>
                            <Typography sx={{ fontSize: 12, color: "#F8FAFC" }}>팔로워</Typography>
                        </Box>
                    </Box>

                    <Box component="button" onClick={onFollowing} style={chipBtn}>
                        <Box
                            sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                                "&:active": { opacity: 0.7 },
                                textAlign: "center",
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#F8FAFC" }}>{followingCnt}</Typography>
                            <Typography sx={{ fontSize: 12, color: "#F8FAFC" }}>팔로잉</Typography>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
