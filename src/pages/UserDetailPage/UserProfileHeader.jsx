import { Avatar, Box, Button, Typography } from "@mui/material";
import FollowButton from "../../components/FollowButton";
import FollowStats from "../Mypage/FollowStats";
import { usePrincipalState } from "../../store/usePrincipalState";
import { Stack } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import { addRoomRequest } from "../../apis/chat/chatApi";
import { useToastStore } from "../../store/useToastStore";
import { useNavigate } from "react-router-dom";

export default function UserProfileHeader({
    user,
    enabledFollow,
    onFollower,
    onFollowing,
}) {
    const { principal } = usePrincipalState();
    const { show } = useToastStore();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => addRoomRequest(data),
        onSuccess: (resp) => {
            navigate(`/chat/room/${resp.data}`);
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const newChatHandler = () => {
        mutation.mutate({
            usernames: [user.username, principal.username],
            userIds: [user.userId, principal.userId]
        })
    }

    const baseAddress = user?.address?.baseAddress ?? "";
    const [city = "", district = ""] = baseAddress.split(" ");

    return (
        <>
            <Box
                sx={{
                    px: 2,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                    }}>
                    <Avatar
                        src={user?.profileImg}
                        alt="profileImg"
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "grey.200",
                            "& img": { objectFit: "cover" },
                        }}
                    />

                    <Box
                        sx={{
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.3,
                        }}>
                        <Typography
                            sx={{
                                fontSize: 22,
                                fontWeight: 800,
                                lineHeight: 1.1,
                            }}>
                            {user?.username ?? "-"}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "text.secondary",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                            {user?.gender ?? "-"} • {city} {district}
                        </Typography>

                        <Typography
                            sx={{ fontSize: 12, color: "text.secondary" }}>
                            {user?.height ?? "-"}cm / {user?.weight ?? "-"}kg
                        </Typography>
                    </Box>
                </Box>

                <Stack direction={"row"} spacing={1}>
                    <Button
                        variant="contained"
                        onClick={newChatHandler}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                        }}>
                        1:1 대화하기
                    </Button>

                    <FollowButton
                        followerUserId={principal?.userId}
                        followingUserId={user?.userId}
                        enabled={enabledFollow}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                        }}
                    />
                </Stack>
            </Box>

            <FollowStats
                followingCnt={user?.followingCnt}
                followerCnt={user?.followerCnt}
                onFollower={onFollower}
                onFollowing={onFollowing}
            />
        </>
    );
}
