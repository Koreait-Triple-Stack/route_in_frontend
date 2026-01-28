import { instance } from "../utils/instance";

export const getAIContextRequest = async (userId) => {
    return await instance.get(`/api/recommend/${userId}`);
};