import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Container, Stack } from "@mui/system";
import { copyPayload, getBoardByBoardId } from "../../apis/board/boardService";
import Header from "./Header";
import CourseDetail from "./CourseDetail";
import { useToastStore } from "../../store/useToastStore";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { usePrincipalState } from "../../store/usePrincipalState";
import RoutineList from "./RoutineList";

function BoardDetailPage() {
    const { principal } = usePrincipalState();
    const { show } = useToastStore();
    const { boardId: boardIdParam } = useParams();
    const boardId = Number(boardIdParam);
    const [openCopy, setOpenCopy] = useState(false);
    const queryClient = useQueryClient();
    const [boardData, setBoardData] = useState({
        title: "",
        content: "",
        type: "",
        tags: [],
    });

    const {
        data: boardResp,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getBoardByBoardId", boardId],
        queryFn: () => getBoardByBoardId(boardId),
        enabled: !!boardId && boardId > 0,
    });

    const copyMutation = useMutation({
        mutationFn: () =>
            copyPayload({
                userId: principal?.userId,
                boardId: boardId,
                type: boardData?.type,
            }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(["getBoardByBoardId", boardId]);
            show(res.message, "success");
        },
        onError: (res) => {
            show(res.message, "error");
        },
    });

    useEffect(() => {
        if (!boardResp) return;
        setBoardData(boardResp.data);
    }, [boardResp]);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    return (
        <Container>
            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "white",
                    borderColor: "divider",
                }}
            >
                {/* 상단 헤더 */}
                <Header boardData={boardData} openCopy={openCopy} setOpenCopy={setOpenCopy} />

                <Divider />
                {boardData.type === "COURSE" ? (
                    <CourseDetail boardId={boardData.boardId} />
                ) : (
                    <>
                        <Stack direction="row" spacing={2} px={2} py={1}>
                            {boardData.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    sx={{
                                        bgcolor: "primary.main",
                                        color: "white",
                                    }}
                                    size="small"
                                />
                            ))}
                        </Stack>
                        <Divider />
                        <RoutineList boardId={boardData.boardId} />
                    </>
                )}

                <Divider />

                <Box sx={{ p: 2.2 }}>{boardData.content}</Box>
            </Paper>

            <Dialog
                open={openCopy}
                onClose={() => setOpenCopy(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: 3, p: 0.5 },
                }}
            >
                <DialogTitle sx={{ fontWeight: 900 }}>저장</DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.5 }}>{boardData.type === "COURSE" ? "러닝 코스 리스트" : "운동 루틴"}에 저장할까요?</Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button fullWidth variant="outlined" onClick={() => setOpenCopy(false)} sx={{ borderRadius: 2, py: 1.1, fontWeight: 800 }}>
                        취소
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            copyMutation.mutate();
                            setOpenCopy(false);
                        }}
                        sx={{ borderRadius: 2, py: 1.1, fontWeight: 900 }}
                    >
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default BoardDetailPage;
