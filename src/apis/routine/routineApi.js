import { instance } from "../utils/instance";

export const addRoutineRequest = async (data) => {
    return await instance.post("/routine/add", data);
};

export const updateRoutineRequest = async (data) => {
    return await instance.post("/routine/update", data);
};

export const getRoutineRequest = async (userId) => {
    return await instance.post("/routine/get", {
        userId: userId,
        boardId: null 
    });
};