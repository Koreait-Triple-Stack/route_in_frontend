import { instance } from "../utils/instance";

export const getRoutineByUserIdRequest = async (userId) => {
    const response = await instance.get(`/routine/get/user/${userId}`);
    return response.data;
};