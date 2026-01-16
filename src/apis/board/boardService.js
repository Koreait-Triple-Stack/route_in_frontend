import {
    addBoardRequest,
    getBoardByBoardIdRequest,
    getBoardListByUserIdRequest,
    getBoardListRequest,
    minusRecommendRequest,
    plusRecommendRequest,
    removeBoardRequest,
    updateBoardRequest,
} from "./boardApi";

export const addBoard = async (data) => {
    const result = await addBoardRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const updateBoard = async (data) => {
    const result = await updateBoardRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const removeBoard = async (data) => {
    const result = await removeBoardRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getBoardList = async () => {
    const result = await getBoardListRequest();
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getBoardByBoardId = async (boarId) => {
    const result = await getBoardByBoardIdRequest(boarId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getBoardListByUserId = async (userId) => {
    const result = await getBoardListByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const plusRecommend = async (data) => {
    const result = await plusRecommendRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const minusRecommend = async (data) => {
    const result = await minusRecommendRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};
