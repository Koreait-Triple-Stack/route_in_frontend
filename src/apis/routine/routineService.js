import {
    updateRoutineRequest,
    getRoutineRequest,
    addRoutineRequest,
    removeRoutineRequest,
    deleteRoutineByRoutineIdRequest,
    changeCheckedRequest
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

export const getRoutine = async (userId, boardId) => {
    const result = await getRoutineRequest(userId, boardId);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const removeRoutine = async (data) => {
    const result = await removeRoutineRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const deleteRoutineByRoutineId = async (routineId) => {
    const result = await deleteRoutineByRoutineIdRequest(routineId);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const changeChecked = async (routineId) => {
    const result = await changeCheckedRequest(routineId);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};