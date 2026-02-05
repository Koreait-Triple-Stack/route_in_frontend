import { Box, Typography } from "@mui/material";

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
        <>
            <Box component="button" onClick={onFollower} style={chipBtn}>
                <Box
                    sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1.5,
                        "&:hover": { bgcolor: "action.hover" },
                        "&:active": { opacity: 0.7 },
                        textAlign: "center",
                    }}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: 16,
                            color: "#F8FAFC",
                        }}>
                        {followerCnt}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#F8FAFC",
                        }}>
                        팔로워
                    </Typography>
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
                    }}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: 16,
                            color: "#F8FAFC",
                        }}>
                        {followingCnt}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#F8FAFC",
                        }}>
                        팔로잉
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
