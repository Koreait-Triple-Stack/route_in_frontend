import { getAIContextRequest } from "./aiRecommendApi";

export const getAIContext = async (userId) => {
    const result = await getAIContextRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};