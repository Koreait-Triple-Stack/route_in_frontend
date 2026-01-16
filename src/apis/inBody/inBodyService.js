import {
    addInBodyRequest,
    deleteInBodyRequest,
    getInBodyListByUserIdRequest
} from "./courseApi";

export const addInBody = async (data) => {
    const result = await addInBodyRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const deleteInBody = async (data) => {
    const result = await deleteInBodyRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const getInBodyListByUserId = async (userId) => {
    const result = await getInBodyListByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};