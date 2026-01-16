import {
    getUserByUserIdRequest,
    changeUsernameRequest,
    changeAddressRequest,
    changeBodyInfoRequest,
    getPrincipalRequest
} from "./accountApi";

export const getPrincipal = async () => {
    const result = await getPrincipalRequest();
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const getUserByUserId = async (userId) => {
    const result = await getUserByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const changeUsername = async (data) => {
    const result = await changeUsernameRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const changeAddress = async (data) => {
    const result = await changeAddressRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const changeBodyInfo = async (data) => {
    const result = await changeBodyInfoRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

