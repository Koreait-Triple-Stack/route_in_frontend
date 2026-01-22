import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Container } from "@mui/system";
import { copyPayload, getBoardByBoardId } from "../../apis/board/boardService";
import Header from "./Header";
import CourseDetail from "./CourseDetail";
import { useToastStore } from "../../store/useToastStore";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { usePrincipalState } from "../../store/usePrincipalState";
import DialogComponent from "../../components/DialogComponent";

function BoardDetailPage() {
    const { principal } = usePrincipalState();
    const { show } = useToastStore();
    const { boardId: boardIdParam } = useParams();
    const boardId = Number(boardIdParam);
    const [openCopy, setOpenCopy] = useState(false);
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
                }}>
                {/* 상단 헤더 */}
                <Header
                    boardData={boardData}
                    openCopy={openCopy}
                    setOpenCopy={setOpenCopy}
                />

                <Divider />
                {boardData.type === "COURSE" ? (
                    <CourseDetail boardId={boardData.boardId} />
                ) : (
                    <></>
                )}

                <Divider />

                <Box sx={{ p: 2.2 }}>{boardData.content}</Box>
            </Paper>

            <DialogComponent
                open={openCopy}
                setOpen={setOpenCopy}
                title={"저장"}
                content={`${
                    boardData.type === "COURSE"
                        ? "러닝 코스 리스트"
                        : "운동 루틴"
                    }에 저장할까요?`}
                onClick={copyOnClickHandler}
            />
        </Container>
    );
}

export default BoardDetailPage;
