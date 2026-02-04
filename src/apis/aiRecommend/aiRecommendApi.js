import { instance } from "../utils/instance";

export const getAIChatListByUserIdRequest = async (userId) => {
    return await instance.get(`/ai/chatList/${userId}`);
};

export const getTodayRecommendationRequest = async (userId) => {
    return await instance.get(`/ai/recommend/${userId}`);
};

export const getAIRespRequest = async (data) => {
    return await instance.post("/ai/question", data);
};

export const getRecommendationCourseRequest = async () => {
    return await instance.get("/ai/recommend/course");
};