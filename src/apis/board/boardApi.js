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
    return instance.post("/board/list");
};

// export const getBoardInfiniteRequest = async (data) => {
//     return instance.post("/board/list/infinite", data);
// };

export const getBoardByBoardIdRequest = async (boarId) => {
    return instance.post(`/board/${boarId}`);
};

export const getBoardListByUserIdRequest = async (userId) => {
    return instance.post(`/board/user/${userId}`);
};
// 여기까지 함

export const getBoardListByKeywordRequest = async (data) => {
    return instance.post("/board/search", data);
};

export const plusRecommendRequest = async (data) => {
    return instance.post("/board/recommend/plus", data);
};

export const minusRecommendRequest = async (data) => {
    return instance.post("/board/recommend/minus", data);
};