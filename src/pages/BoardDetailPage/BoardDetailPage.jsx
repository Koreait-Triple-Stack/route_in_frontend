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
import { useQuery } from "@tanstack/react-query";
import { Container } from "@mui/system";
import { getBoardByBoardId } from "../../apis/board/boardService";
import Header from "./Header";
import CourseDetail from "./CourseDetail";
import { useToastStore } from "../../store/useToastStore";
import Loading from "../../components/Loading";

function BoardDetailPage() {
    const { show } = useToastStore();
    const { boardId: boardIdParam } = useParams();
    const boardId = Number(boardIdParam);
    const [openCopy, setOpenCopy] = useState(false);
    const [boardData, setBoardData] = useState({
        title: "",
        content: "",
    });

    const {
        data: boardResp,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getBoardByBoardId", boardId],
        queryFn: () => getBoardByBoardId(boardId),
        enabled: boardId > 0,
    });

    useEffect(() => {
        if (!boardResp) return;
        setBoardData(boardResp.data);
    }, [boardResp]);

    const copyHandler = () => {
        // closeMenu();
        // 러닝 코스, 운동루틴 저장 버튼
        // boardId, userId로 요청을 보내서 boardId로 db에서 course를 찾은 다음
        // boardId = null, userId = userId로 해서 db에 저장
        show("저장 완료", "success");
    };

    if (isLoading) return <Loading />;
    if (error) return <></>;

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 56, // ✅ 네비 높이만큼 제외
                display: "flex",
                justifyContent: "center",
                px: 2,
                bgcolor: "background.default",
            }}>
            <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 500 }}>
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
            </Container>

            <Dialog
                open={openCopy}
                onClose={() => setOpenCopy(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: 3, p: 0.5 },
                }}>
                <DialogTitle sx={{ fontWeight: 900 }}>저장</DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Typography
                        sx={{ color: "text.secondary", lineHeight: 1.5 }}>
                        {boardData.type === "COURSE"
                            ? "러닝 코스 리스트"
                            : "운동 루틴"}
                        에 저장할까요?
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setOpenCopy(false)}
                        sx={{ borderRadius: 2, py: 1.1, fontWeight: 800 }}>
                        취소
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            copyHandler();
                            setOpenCopy(false);
                        }}
                        sx={{ borderRadius: 2, py: 1.1, fontWeight: 900 }}>
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default BoardDetailPage;
