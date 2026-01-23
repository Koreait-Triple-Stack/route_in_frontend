import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeFollow, getFollowStatus } from "../apis/follow/followService";

export default function FollowButton({
  followerUserId,
  followingUserId,
  enabled = true,
  size = "medium",
  sx,
}) {
  const queryClient = useQueryClient();

  // 입력값 유효성 검사(버튼을 보여줄지 안보여줄지)
  // 내 userId가 유효한 숫자인지
  const isValidFollower =
    Number.isFinite(followerUserId) && Number(followerUserId) > 0;
  // 상대 userId가 유효한 숫자인지
  const isValidFollowing =
    Number.isFinite(followingUserId) && Number(followingUserId) > 0;

  // 자기 자신을 팔로우하는 상황 방지
  const isSelf =
    isValidFollower && isValidFollowing && followerUserId === followingUserId;

  const canUseFollow =
    enabled && isValidFollower && isValidFollowing && !isSelf;

  // 서버에서 팔로우 상태 가져오기, 로딩/에러상태도 받기
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

  
  // 팔로우/언팔로우 변경
  const { mutate: toggleFollow, isPending: isToggling } = useMutation({
    mutationFn: () =>
      changeFollow({
        followerUserId,
        followingUserId,
        isFollowing,
      }),
      // 서버 변경 성공했을 때 실행되는 콜백
    onSuccess: () => {

      // 팔로우 바뀌면 영향 받는 화면들 
      const keys = [
        ["getFollowStatus", followerUserId, followingUserId],
        ["getUserByUserId", followingUserId],
        ["getUserByUserId", followerUserId],
        ["getFollowerUserList", followingUserId],
        ["getFollowingUserList", followingUserId],
        ["getFollowingUserList", followerUserId],
        ["getFollowerUserList", followerUserId],
      ];
      keys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
    },
  });

  // 버튼을 보여주면 안되는 경우
  if (!canUseFollow) return null;

  // 로딩/토글 중에는 버튼 비활성화
  const disabled = isFollowStatusLoading || isToggling;

  // 버튼 표시
  const label = isFollowStatusLoading
    ? "로딩..."
    : isFollowStatusError
      ? "오류"
      : isFollowing
        ? "팔로잉"
        : "팔로우";
  const variant = isFollowing ? "outlined" : "contained";
  return (
    <Button
      variant={variant}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        toggleFollow();
      }}
      sx={{ borderRadius: 2, fontWeight: 900, whiteSpace: "nowrap", ...sx }}
      title={isFollowStatusError ? String(followStatusError) : undefined}
    >
      {label}
    </Button>
  );
}
