import { instance } from "../utils/instance";

export const addRoutineRequest = async (data) => {
    return await instance.post("/routine/add", data);
};

export const updateRoutineRequest = async (data) => {
    return await instance.post("/routine/update", data);
};

export const getRoutineRequest = async (userId, boardId) => {
    return await instance.post("/routine/get", {
        userId: userId,
        boardId: boardId 
    });
};

export const removeRoutineRequest = async (data) => {
    return await instance.post("/routine/remove", data);
};

export const deleteRoutineByRoutineIdRequest = async (routineId) => {
    return await instance.post(`/routine/delete/${routineId}`);
};

export const changeCheckedRequest = async (routineId) => {
    return await instance.post("/routine/change/checked", routineId);
};