import React, { useState } from "react";
import {
    Box,
    Typography,
    Stack,
    IconButton,
    Divider,
    Button,
} from "@mui/material";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { usePrincipalState } from "../../store/usePrincipalState";
import CommentInput from "./CommentInput";
import { useComment } from "../../hooks/useComment";
import UserAvatarLink from "../../components/UserAvatarLink";
import DialogComponent from "../../components/DialogComponent";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}. ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

function CommentItem({ comment, boardId, isReply = false }) {
    const { principal } = usePrincipalState();
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { addComment, deleteComment } = useComment(boardId);

    const handleReplySubmit = (content) => {
        addComment({
            boardId,
            userId: principal.userId,
            content,
            parentId: comment.commentId,
        });
        setShowReplyInput(false);
    };

    if (comment.isDeleted) {
        return (
            <Box
                sx={{
                    py: 2,
                    px: 2,
                    pl: isReply ? 6 : 2,
                    bgcolor: isReply ? "#f8f9fa" : "white",
                }}>
                <Typography color="text.secondary" variant="body2">
                    삭제된 댓글입니다.
                </Typography>
                <Divider sx={{ mt: 2 }} />
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    py: 2,
                    px: 2,
                    pl: isReply ? 5 : 2,
                    bgcolor: isReply ? "#f8f9fa" : "white",
                    borderBottom: "1px solid #f1f1f1",
                }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                    {isReply && (
                        <SubdirectoryArrowRightIcon
                            sx={{ color: "#bbb", fontSize: 20 }}
                        />
                    )}
                    <UserAvatarLink
                        userId={comment?.userId}
                        src={comment?.profileImg}
                        size={36}
                    />
                    <Stack>
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                            {comment.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.createDt)}
                        </Typography>
                    </Stack>
                    <Box flexGrow={1} />

                    {principal?.userId === comment.userId && (
                        <IconButton
                            size="small"
                            onClick={() => setDeleteOpen(true)}>
                            <DeleteIcon
                                fontSize="small"
                                sx={{
                                    color: "#ddd",
                                    "&:hover": { color: "#ff5252" },
                                }}
                            />
                        </IconButton>
                    )}
                </Stack>

                <Typography
                    variant="body2"
                    sx={{
                        ml: isReply ? 4 : 0,
                        mb: 1,
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.6,
                        color: "#333",
                    }}>
                    {comment.content}
                </Typography>

                {!isReply && (
                    <Box sx={{ ml: 0 }}>
                        <Button
                            startIcon={
                                <ChatBubbleOutlineIcon
                                    sx={{ fontSize: "1rem !important" }}
                                />
                            }
                            size="small"
                            sx={{
                                color: "#888",
                                fontSize: "0.8rem",
                                minWidth: 0,
                                p: 0.5,
                            }}
                            onClick={() => setShowReplyInput(!showReplyInput)}>
                            답글
                        </Button>
                    </Box>
                )}
            </Box>

            {showReplyInput && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: 2,
                        pl: 2,
                    }}>
                    <SubdirectoryArrowRightIcon sx={{ color: "grey.500" }} />
                    <CommentInput
                        placeholder={`${comment.username}님에게 답글 남기기`}
                        onSubmit={handleReplySubmit}
                        onCancel={() => setShowReplyInput(false)}
                    />
                </Box>
            )}
            <DialogComponent
                open={deleteOpen}
                setOpen={setDeleteOpen}
                title="댓글 삭제"
                content="정말 삭제하시겠습니까?"
                onClick={() => deleteComment(comment.commentId)}
                color="error"
                ment="삭제"
            />
        </>
    );
}

export default CommentItem;
