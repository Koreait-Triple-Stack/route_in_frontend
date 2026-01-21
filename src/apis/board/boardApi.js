import { instance } from "../utils/instance";

export const addBoardRequest = async (data) => {
    return instance.post("/board/add", data);
};

export const updateBoardRequest = async (data) => {
    return instance.post("/board/update", data);
};

export const removeBoardRequest = async (data) => {
    return instance.post("/board/remove", data);
};

export const getBoardListRequest = async () => {
    return instance.get("/board/list");
};

export const getBoardInfiniteRequest = async (params) => {
    return instance.get("/board/list/infinite", {params});
};

export const getBoardByBoardIdRequest = async (boarId) => {
    return instance.get(`/board/${boarId}`);
};

export const getBoardListByUserIdRequest = async (userId) => {
    return instance.get(`/board/user/${userId}`);
};

// export const getBoardListByKeywordRequest = async (data) => {
//     return instance.post("/board/search", data);
// };

export const plusRecommendRequest = async (data) => {
    return instance.post("/board/recommend/plus", data);
};

export const minusRecommendRequest = async (data) => {
    return instance.post("/board/recommend/minus", data);
};

export const getRecommendListByBoardIdRequest = async (boardId) => {
    return instance.get(`/board/recommend/${boardId}`);
};
