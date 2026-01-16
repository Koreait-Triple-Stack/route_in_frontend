import {
    updateRoutineRequest,
    getRoutineRequest,
    addRoutineRequest
} from "./routineApi";

export const addRoutine = async (data) => {
    const result = await addRoutineRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const updateRoutine = async (data) => {
    const result = await updateRoutineRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const getRoutine = async (userId) => {
    const result = await getRoutineRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};