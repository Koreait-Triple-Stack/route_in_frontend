import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Avatar,
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
import { usePrincipalState } from "../../store/usePrincipalState";

import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";

import FollowStats from "../Mypage/FollowStats";
import PostCard from "../BoardListPage/PostCard";

import { getFollowStatus, changeFollow } from "../../apis/follow/followService";

export default function UserDetailPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { userId: userIdParam } = useParams();
    const profileUserId = Number(userIdParam);

    const { principal } = usePrincipalState();
    const myUserId = Number(principal?.userId);

    const isValidProfileUserId =
        Number.isFinite(profileUserId) && profileUserId > 0;
    const isMe =
        Number.isFinite(myUserId) && myUserId > 0 && myUserId === profileUserId;

    const enabledFollow =
        Number.isFinite(myUserId) &&
        myUserId > 0 &&
        isValidProfileUserId &&
        !isMe;

    if (!isValidProfileUserId) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 900 }}>
                    잘못된 접근입니다. (userId 없음)
                </Typography>
            </Box>
        );
    }

    //유저 정보
    const {
        data: userResp,
        isLoading: isUserLoading,
        error: userError,
    } = useQuery({
        queryKey: ["getUserByUserId", profileUserId],
        queryFn: () => getUserByUserId(profileUserId),
        enabled: isValidProfileUserId,
        staleTime: 30000,
    });

    //  유저 게시글
    const {
        data: boardResp,
        isLoading: isBoardLoading,
        error: boardError,
    } = useQuery({
        queryKey: ["getBoardListByUserId", profileUserId],
        queryFn: () => getBoardListByUserId(profileUserId),
        enabled: isValidProfileUserId,
        staleTime: 30000,
    });

    // 팔로우 상태 조회
    const { data: followStatusResp, isLoading: isFollowStatusLoading } =
        useQuery({
            queryKey: ["getFollowStatus", myUserId, profileUserId],
            queryFn: () =>
                getFollowStatus({
                    followerUserId: myUserId,
                    followingUserId: profileUserId,
                }),
            enabled: enabledFollow,
            staleTime: 10_000,
        });

    const isFollowing = !!followStatusResp?.data;

    // 팔로우 토글 mutation
    const changeFollowMutation = useMutation({
        mutationFn: () =>
            changeFollow({
                followerUserId: myUserId,
                followingUserId: profileUserId,
                isFollowing,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getFollowStatus", myUserId, profileUserId],
            });
            queryClient.invalidateQueries({
                queryKey: ["getUserByUserId", profileUserId],
            });
            queryClient.invalidateQueries({
                queryKey: ["getUserByUserId", myUserId],
            });
        },
    });

    if (isUserLoading) return <Loading />;
    if (userError) return <ErrorComponent error={userError} />;

    const user = userResp?.data;

    const baseAddress = user?.address?.baseAddress ?? "";
    const [city = "", district = ""] = baseAddress.split(" ");

    const profileSrc = user?.profileImageUrl ?? user?.profileImg ?? null;

    const boardsRaw =
        boardResp?.data?.boardRespDtoList ?? boardResp?.data ?? [];
    const userBoards = Array.isArray(boardsRaw) ? boardsRaw : [];

    return (
        <Container>
            <Paper
                variant="outlined"
                sx={{
                    position: "relative",
                    width: "100%",
                    bgcolor: "background.paper",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                }}>
                {/* Title */}
                <Box sx={{ px: 2 }}>
                    <Typography
                        sx={{
                            bgcolor: "transparent",
                            py: 3,
                            px: 1,
                            fontSize: 14,
                            fontWeight: 700,
                            color: "text.primary",
                        }}>
                        유저 프로필
                    </Typography>
                </Box>

                <Divider />

                {/* Profile */}
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
                            sx={{
                                width: 72,
                                height: 72,
                                bgcolor: "grey.200", // ✅ 로딩 중 배경
                                "& img": { objectFit: "cover" },
                            }}
                            src={user?.profileImg}
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
                                {user?.height ?? "-"}cm / {user?.weight ?? "-"}
                                kg
                            </Typography>
                        </Box>
                    </Box>

                    {enabledFollow && (
                        <Button
                            variant={isFollowing ? "outlined" : "contained"}
                            disabled={
                                isFollowStatusLoading ||
                                changeFollowMutation.isPending
                            }
                            onClick={() => changeFollowMutation.mutate()}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 900,
                                whiteSpace: "nowrap",
                            }}>
                            {isFollowStatusLoading
                                ? "로딩..."
                                : isFollowing
                                  ? "팔로잉 취소"
                                  : "팔로우"}
                        </Button>
                    )}
                </Box>

                {/* Follow stats */}
                <FollowStats
                    followingCnt={user?.followingCnt ?? 0}
                    followerCnt={user?.followerCnt ?? 0}
                    onFollower={() =>
                        navigate(`/user/${profileUserId}/following`)
                    }
                    onFollowing={() =>
                        navigate(`/user/${profileUserId}/follower`)
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
