import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, deleteComment } from "../apis/comment/commentService";
import { useToastStore } from "../store/useToastStore";

export const useComment = (boardId) => {
    const queryClient = useQueryClient();
    const { show } = useToastStore();

    const addMutation = useMutation({
        mutationFn: (newComment) => addComment(newComment),
        onSuccess: () => {
            queryClient.invalidateQueries(["getCommentListByBoardId", boardId]);
        },
        onError: (error) => show(error.message, "error")
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId) => deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries(["getCommentListByBoardId", boardId]);
        },
        onError: (error) => show(error.message, "error")
    });

    return {
        addComment: addMutation.mutate,
        deleteComment: deleteMutation.mutate
    };
};