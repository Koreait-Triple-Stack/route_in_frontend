import React, { useState, useEffect } from "react";
import { Container, Stack, Typography, Box, IconButton, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import PostCard from "../../pages/MyBoardListPage/PostCard"; 
import { usePrincipalState } from "../../store/usePrincipalState"; 
import { getBoardListByUserId } from "../../apis/board/boardService";
import { useQuery } from "@tanstack/react-query";

function MyBoardListPage() {
    const navigate = useNavigate();
    const { principal } = usePrincipalState(); 

    const { data: response, isLoading } = useQuery({
        queryKey: ["getBoardListByUserId", principal?.userId],
        queryFn: () => getBoardListByUserId(principal?.userId),
        staleTime: 30000,
        enabled: !!principal?.userId,
    });

    const respData = response?.data || [];

    if (isLoading) return <div>로딩중...</div>;

    return (
        <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 500 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    작성한 게시물 관리
                </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
                {respData.length > 0 ? (
                    respData.map((post) => (
                        <PostCard
                            key={post.userId}
                            post={post}
                        />
                    ))
                ) : (
                    <Box sx={{ py: 10, textAlign: "center" }}>
                        <Typography color="text.secondary">작성한 게시물이 없습니다.</Typography>
                    </Box>
                )}
            </Stack>
        </Container>
    );
}

export default MyBoardListPage;
