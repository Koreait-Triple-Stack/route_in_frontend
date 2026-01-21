import React, { useEffect, useState } from "react";
import { Box, Divider, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@mui/system";
import { getBoardByBoardId } from "../../apis/board/boardService";
import Header from "./Header";

function BoardDetailPage() {
    const { boardId: boardIdParam } = useParams();
    const boardId = Number(boardIdParam);
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

    // 폼 초기화
    useEffect(() => {
        if (!boardResp) return;
        setBoardData(boardResp.data);
    }, [boardResp]);

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
                    <Header boardData={boardData} />

                    <Divider />

                    <Box sx={{ p: 2.2 }}>
                        {boardData.content}
                    </Box>
                </Paper>

                {(isLoading || error) && (
                    <Box sx={{ mt: 2, color: "text.secondary", fontSize: 13 }}>
                        {isLoading ? "로딩중..." : "조회 실패"}
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default BoardDetailPage;
