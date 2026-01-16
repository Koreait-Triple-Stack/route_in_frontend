import {
    updateRoutineRequest,
    getRoutineRequest
} from "./routineApi";

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