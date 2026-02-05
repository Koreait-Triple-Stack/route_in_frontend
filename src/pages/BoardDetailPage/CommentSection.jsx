import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getCommentListByBoardId } from "../../apis/comment/commentService";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useComment } from "../../hooks/useComment";

function CommentSection({ boardId }) {
    const { principal } = usePrincipalState();

    const { data: commentResp } = useQuery({
        queryKey: ["getCommentListByBoardId", boardId],
        queryFn: () => getCommentListByBoardId(boardId),
        enabled: !!boardId,
    });

    const { addComment } = useComment(boardId);

    const comments = commentResp?.data.comments || [];

    const handleRootSubmit = (content) => {
        addComment({
            boardId,
            userId: principal.userId,
            content,
            parentId: null,
        });
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2, px: 1 }}>
                <Typography
                    variant="h6"
                    sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                    댓글
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: "primary.main",
                    }}>
                    {commentResp?.data?.totalCount}
                </Typography>
            </Stack>

            <Box
                sx={{
                    borderTop: "1px solid #333",
                    borderBottom: "1px solid #e0e0e0",
                    mb: 3,
                }}>
                {comments.length === 0 ? (
                    <Box sx={{ py: 5, textAlign: "center", color: "#888" }}>
                        첫 번째 댓글을 남겨보세요!
                    </Box>
                ) : (
                    comments.map((comment) => {
                        const commentList = comment.commentRespDtoList || [];
                        // 살아있는 자식이 있는지 확인
                        const hasLiveChild = commentList.some(
                            (child) => !child.isDeleted,
                        );

                        if (comment.isDeleted && !hasLiveChild) {
                            return null;
                        }

                        return (
                            <React.Fragment key={comment.commentId}>
                                <CommentItem
                                    comment={comment}
                                    boardId={boardId}
                                />

                                {commentList.map((reply) => {
                                    if (reply.isDeleted) return null;
                                    return (
                                        <CommentItem
                                            key={reply.commentId}
                                            comment={reply}
                                            boardId={boardId}
                                            isReply={true}
                                        />
                                    );
                                })}
                            </React.Fragment>
                        );
                    })
                )}
            </Box>

            <CommentInput onSubmit={handleRootSubmit} />
        </Box>
    );
}

export default CommentSection;
