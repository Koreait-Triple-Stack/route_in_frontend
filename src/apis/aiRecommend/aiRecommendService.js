import { getAIChatListByUserIdRequest, getAIRespRequest, getRecommendationCourseRequest, getTodayRecommendationRequest } from "./aiRecommendApi";

export const getAIChatListByUserId = async (userId) => {
    const result = await getAIChatListByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getTodayRecommendation = async (userId) => {
    const result = await getTodayRecommendationRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getAIResp = async (data) => {
    const result = await getAIRespRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getRecommendationCourse = async () => {
    const result = await getRecommendationCourseRequest();
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};