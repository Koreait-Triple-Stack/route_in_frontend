// src/pages/UserDetailPage/UserDetailPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import {
    getFollowerUserList,
    getFollowingUserList,
} from "../../apis/follow/followService";

import { usePrincipalState } from "../../store/usePrincipalState";
import UserProfileHeader from "./UserProfileHeader";

import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import PostCard from "../BoardListPage/PostCard";

export default function UserDetailPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
  
    const { userId: userIdParam } = useParams();
    const profileUserId = Number(userIdParam);

    const { principal } = usePrincipalState();
    const myUserId = Number(principal?.userId);

    // userId 유효성 검사 + 자기 자신 여부 판단
    const isValidProfileUserId =
        Number.isFinite(profileUserId) && profileUserId > 0;
    const isValidMyUserId = Number.isFinite(myUserId) && myUserId > 0;

    const isMe =
        isValidMyUserId && isValidProfileUserId && myUserId === profileUserId;
    const enabledFollow = isValidMyUserId && isValidProfileUserId && !isMe;

    if (!isValidProfileUserId) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 900 }}>
                    잘못된 접근입니다. (userId 없음)
                </Typography>
            </Box>
        );
    }

    // 유저 정보
    const {
        data: userResp,
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError,
    } = useQuery({
        queryKey: ["getUserByUserId", profileUserId],
        queryFn: () => getUserByUserId(profileUserId),
        enabled: isValidProfileUserId,
        staleTime: 30000,
    });

    // 유저 게시글
    const {
        data: boardResp,
        isLoading: isBoardLoading,
        isError: isBoardError,
        error: boardError,
    } = useQuery({
        queryKey: ["getBoardListByUserId", profileUserId],
        queryFn: () => getBoardListByUserId(profileUserId),
        enabled: isValidProfileUserId,
        staleTime: 30000,
    });

    // 팔로워/팔로잉 리스트 (숫자를 리스트 길이로 맞춰서 불일치 방지)
    const { data: followerListResp } = useQuery({
        queryKey: ["getFollowerUserList", profileUserId],
        queryFn: () => getFollowerUserList(profileUserId),
        enabled: isValidProfileUserId,
        staleTime: 30000,
    });

    const { data: followingListResp } = useQuery({
        queryKey: ["getFollowingUserList", profileUserId],
        queryFn: () => getFollowingUserList(profileUserId),
        enabled: isValidProfileUserId,
        staleTime: 30000,
    });

    // 팔로워 응답 파싱
    const followerRaw = followerListResp?.data ?? followerListResp;
    const followerPayload = followerRaw?.data ?? followerRaw;
    const followerList = Array.isArray(followerPayload) ? followerPayload : [];

    // 팔로잉 응답 파싱
    const followingRaw = followingListResp?.data ?? followingListResp;
    const followingPayload = followingRaw?.data ?? followingRaw;
    const followingList = Array.isArray(followingPayload)
        ? followingPayload
        : [];

    if (isUserLoading) return <Loading />;
    if (isUserError) return <ErrorComponent error={userError} />;

    // 유저 정보 후처리(주소/프로필 이미지/게시판 배열 추출)
    const user = userResp?.data;
    const baseAddress = user?.address?.baseAddress ?? "";
    const [city = "", district = ""] = baseAddress.split(" ");
    const profileSrc = user?.profileImageUrl ?? user?.profileImg ?? null;
    const boardsRaw =
        boardResp?.data?.boardRespDtoList ?? boardResp?.data ?? [];
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

                {/* Header (프로필 + 팔로우 버튼 + 팔로워/팔로잉 통계) */}
                <UserProfileHeader
                    user={user}
                    profileSrc={profileSrc}
                    city={city}
                    district={district}
                    myUserId={myUserId}
                    profileUserId={profileUserId}
                    enabledFollow={enabledFollow}
                    followerCnt={followerList.length}
                    followingCnt={followingList.length}
                    onFollower={() =>
                        navigate(`/user/${profileUserId}/followers`)
                    }
                    onFollowing={() =>
                        navigate(`/user/${profileUserId}/followings`)
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
                    ) : isBoardError ? (
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
