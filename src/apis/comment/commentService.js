import { addCommentRequest, deleteCommentRequest, getCommentListByBoardIdRequest } from "./commentApi";

export const addComment = async (data) => {
    const result = await addCommentRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getCommentListByBoardId = async (boardId) => {
    const result = await getCommentListByBoardIdRequest(boardId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const deleteComment = async (commentId) => {
    const result = await deleteCommentRequest(commentId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};