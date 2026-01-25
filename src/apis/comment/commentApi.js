import { instance } from "../utils/instance";

export const addCommentRequest = async (data) => {
    return await instance.post("/comment/add", data);
};

export const getCommentListByBoardIdRequest = async (boardId) => {
    return await instance.get(`/comment/${boardId}`);
};

export const deleteCommentRequest = async (commentId) => {
    return await instance.get(`/comment/delete/${commentId}`);
};