import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { getUserByUserId } from "../../apis/account/accountService";
import { getBoardListByUserId } from "../../apis/board/boardService";

import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";

import FollowStats from "../Mypage/FollowStats";
import PostCard from "../BoardListPage/PostCard";

export default function UserDetailPage() {
  const navigate = useNavigate();
  const { userId: userIdParam } = useParams();
  const userId = Number(userIdParam);


  if (!userId || userId <= 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>
          잘못된 접근입니다. (userId 없음)
        </Typography>
      </Box>
    );
  }

 
  const {
    data: userResp,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["getUserByUserId", userId],
    queryFn: () => getUserByUserId(userId),
    enabled: userId > 0,
    staleTime: 30_000,
  });
 // 유저가 작성한 게시글
  const {
    data: boardResp,
    isLoading: isBoardLoading,
    error: boardError,
  } = useQuery({
    queryKey: ["getBoardListByUserId", userId],
    queryFn: () => getBoardListByUserId(userId),
    enabled: userId > 0,
    staleTime: 30_000,
  });

  const user = userResp?.data;


  const [followerCnt, setFollowerCnt] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);

  // userId 바뀌면 리셋
  useEffect(() => {
    setFollowerCnt(0);
    setIsFollowed(false);
  }, [userId]);

  // user 로드되면 초기값 세팅
  useEffect(() => {
    if (!user) return;
    setFollowerCnt(Number(user?.followerCnt ?? 0));
    setIsFollowed(false); // 서버의 "내가 팔로우 중인지" 값이 없으니 일단 false로
  }, [user]);

  const onToggleFollow = () => {
    setIsFollowed((prev) => {
      setFollowerCnt((c) => (prev ? Math.max(0, c - 1) : c + 1));
      return !prev;
    });
  };

  // --- Derived values ---
  if (isUserLoading) return <Loading />;
  if (userError) return <ErrorComponent error={userError} />;

  const baseAddress = user?.address?.baseAddress ?? "";
  const [city = "", district = ""] = baseAddress.split(" ");

  const profileSrc = user?.profileImageUrl ?? user?.profileImg ?? null;

  const boardsRaw = boardResp?.data?.boardRespDtoList ?? boardResp?.data ?? [];
  const userBoards = Array.isArray(boardsRaw) ? boardsRaw : [];

 
  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Paper
        variant="outlined"
        sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "white" }}
      >
        {/* Title */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
            유저 프로필
          </Typography>
        </Box>

        {/* Profile */}
        <Box
          sx={{
            px: 2,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "grey.100",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {profileSrc ? (
                <Box
                  component="img"
                  src={profileSrc}
                  alt="profile"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography sx={{ fontWeight: 800, color: "text.secondary" }}>
                  profile
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 0.3,
              }}
            >
              <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
                {user?.username ?? "-"}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.gender ?? "-"} • {city} {district}
              </Typography>

              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {user?.height ?? "-"}cm / {user?.weight ?? "-"}kg
              </Typography>
            </Box>
          </Box>

         
          <Button
            variant={isFollowed ? "outlined" : "contained"}
            onClick={onToggleFollow}
            sx={{ borderRadius: 2, fontWeight: 900 }}
          >
            {isFollowed ? "팔로워 취소" : "팔로워"}
          </Button>
        </Box>

        {/* Follow stats */}
        <FollowStats
          followerCnt={followerCnt}
          followingCnt={user?.followingCnt ?? 0}
          onFollower={() => navigate("/mypage/follower", { state: { userId } })}
          onFollowing={() =>
            navigate("/mypage/following", { state: { userId } })
          }
        />

        <Divider />

        {/* Boards */}
        <Box sx={{ px: 2, py: 2 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 14, mb: 1.2 }}>
            작성한 게시글
          </Typography>

          {isBoardLoading ? (
            <Typography sx={{ color: "text.secondary", py: 1 }}>
              로딩중...
            </Typography>
          ) : boardError ? (
            <Typography sx={{ color: "error.main", py: 1 }}>
              게시글을 불러오지 못했습니다.
            </Typography>
          ) : userBoards.length === 0 ? (
            <Typography sx={{ color: "text.secondary", py: 1 }}>
              작성한 게시글이 없습니다.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {userBoards.map((board) => (
                <PostCard key={board.boardId} board={board} />
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
