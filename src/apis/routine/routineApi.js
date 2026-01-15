import { instance } from "../utils/instance";

export const updateRoutineRequest = async (data) => {
    const response = await instance.post("/routine/update", data);
    return response.data;
};

export const getRoutineRequest = async (userId) => {
    const response = await instance.post("/routine/get", {
        userId: userId,
        boardId: null 
    });
    return response.data;
};