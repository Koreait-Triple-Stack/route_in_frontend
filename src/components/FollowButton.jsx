import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeFollow, getFollowStatus } from "../apis/follow/followService";

export default function FollowButton({
    followerUserId,
    followingUserId,
    enabled = true,
    sx,
}) {
    const queryClient = useQueryClient();

    const isValidFollower =
        Number.isFinite(followerUserId) && Number(followerUserId) > 0;
    const isValidFollowing =
        Number.isFinite(followingUserId) && Number(followingUserId) > 0;

    const isSelf =
        isValidFollower &&
        isValidFollowing &&
        followerUserId === followingUserId;

    const canUseFollow =
        enabled && isValidFollower && isValidFollowing && !isSelf;

    const {
        data: followStatusResp,
        isLoading: isFollowStatusLoading,
        isError: isFollowStatusError,
        error: followStatusError,
    } = useQuery({
        queryKey: ["getFollowStatus", followerUserId, followingUserId],
        queryFn: () =>
            getFollowStatus({
                followerUserId,
                followingUserId,
            }),
        enabled: canUseFollow,
        staleTime: 10000,
    });
    const isFollowing = !!followStatusResp?.data;

    const { mutate: toggleFollow, isPending: isToggling } = useMutation({
        mutationFn: () =>
            changeFollow({
                followerUserId,
                followingUserId,
                isFollowing,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries([
                "getFollowStatus",
                followerUserId,
                followingUserId,
            ]);
            queryClient.invalidateQueries(["getUserByUserId", followingUserId]);
        },
    });

    if (!canUseFollow) return null;

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            disabled={isFollowStatusLoading || isToggling}
            onClick={(e) => {
                e.stopPropagation();
                toggleFollow();
            }}
            sx={{
                borderRadius: 2,
                fontWeight: 900,
                whiteSpace: "nowrap",
                ...sx,
            }}
            title={isFollowStatusError ? String(followStatusError) : undefined}>
            {isFollowStatusLoading
                ? "로딩..."
                : isFollowStatusError
                  ? "오류"
                  : isFollowing
                    ? "팔로잉"
                    : "팔로우"}
        </Button>
    );
}
