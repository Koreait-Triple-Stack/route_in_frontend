import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Box,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { getUserByUserId } from "../../apis/account/accountService";
import { getBoardListByUserId } from "../../apis/board/boardService";

import { usePrincipalState } from "../../store/usePrincipalState";
import UserProfileHeader from "./UserProfileHeader";

import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import PostCard from "../BoardListPage/PostCard";

export default function UserDetailPage() {
    const navigate = useNavigate();

    const { userId } = useParams();
    const profileUserId = Number(userId ?? 0);

    const { principal } = usePrincipalState();
    const myUserId = Number(principal?.userId ?? 0);

    const isMe =
        myUserId > 0 && profileUserId > 0 && myUserId === profileUserId;

    const enabledFollow =
        myUserId > 0 && profileUserId > 0 && myUserId !== profileUserId;

    // 내 페이지면 강제이동
    useEffect(() => {
        if (isMe) navigate("/mypage", { replace: true });
    }, [isMe, navigate]);

    if (isMe) return null;

    const {
        data: userResp,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["getUserByUserId", profileUserId],
        queryFn: () => getUserByUserId(profileUserId),
        enabled: profileUserId > 0,
        staleTime: 10000,
    });

    const {
        data: boardResp,
        isLoading: isBoardLoading,
        isError: isBoardError,
    } = useQuery({
        queryKey: ["getBoardListByUserId", profileUserId],
        queryFn: () => getBoardListByUserId(profileUserId),
        enabled: profileUserId > 0,
        staleTime: 10000,
    });

    if (isLoading) return <Loading />;
    if (isError) return <ErrorComponent error={Error} />;

    return (
        <Container>
            <Paper
                variant="outlined"
                sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "white" }}
            >
                <Box sx={{ px: 2, py: 2 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                        유저 프로필
                    </Typography>
                </Box>

                <Divider />

                <UserProfileHeader
                    user={userResp?.data}
                    enabledFollow={enabledFollow}
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
                    ) : boardResp?.data?.length === 0 ? (
                        <Typography sx={{ color: "text.secondary", py: 1 }}>
                            작성한 게시글이 없습니다.
                        </Typography>
                    ) : (
                        <Stack spacing={2}>
                            {boardResp?.data?.map((board) => (
                                <PostCard key={board.boardId} board={board} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}
