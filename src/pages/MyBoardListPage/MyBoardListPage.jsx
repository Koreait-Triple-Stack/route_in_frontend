import { Container, Stack, Typography, Box, Divider } from "@mui/material";
import { usePrincipalState } from "../../store/usePrincipalState";
import { getBoardListByUserId } from "../../apis/board/boardService";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../BoardListPage/PostCard";
import Loading from "../../components/Loading";

function MyBoardListPage() {
    const { principal } = usePrincipalState();

    const { data: response, isLoading } = useQuery({
        queryKey: ["getBoardListByUserId", principal?.userId],
        queryFn: () => getBoardListByUserId(principal?.userId),
        staleTime: 30000,
        enabled: !!principal?.userId,
    });

    const respData = response?.data || [];

    if (isLoading) return <Loading />;

    return (
        <Container sx={{ py: 2 }}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    작성한 게시물 관리
                </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
                {respData.length > 0 ? (
                    respData.map((board) => (
                        <PostCard key={board.boardId} board={board} />
                    ))
                ) : (
                    <Box sx={{ py: 10, textAlign: "center" }}>
                        <Typography color="text.secondary">
                            작성한 게시물이 없습니다.
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Container>
    );
}

export default MyBoardListPage;
