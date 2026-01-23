import React, { useEffect, useState } from "react";
import { Box, Chip, Divider, Paper } from "@mui/material";
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
import DialogComponent from "../../components/DialogComponent";

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
        course: null,
        routines: null,
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

    const copyOnClickHandler = () => {
        copyMutation.mutate();
        setOpenCopy(false);
    };

    if (isLoading || !boardId) return <Loading />;
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
                }}>
                {/* 상단 헤더 */}
                <Header
                    boardData={boardData}
                    setOpenCopy={setOpenCopy}
                    boardId={boardId}
                />

                <Divider />
                {boardData.type === "COURSE" && (
                    <CourseDetail course={boardData.course} />
                )}
                {boardData.type === "ROUTINE" && (
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
                        <RoutineList routines={boardData.routines} />
                    </>
                )}

                <Divider />

                <Box sx={{ p: 2.2 }}>{boardData.content}</Box>
            </Paper>

            <DialogComponent
                open={openCopy}
                setOpen={setOpenCopy}
                title={"저장"}
                content={`${boardData.type === "COURSE" ? "러닝 코스 리스트" : "운동 루틴"}에 저장할까요?`}
                onClick={copyOnClickHandler}
            />
        </Container>
    );
}

export default BoardDetailPage;
