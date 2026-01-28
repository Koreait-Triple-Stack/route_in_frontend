import {
    getUserByUserIdRequest,
    changeUsernameRequest,
    changeAddressRequest,
    changeBodyInfoRequest,
    getPrincipalRequest,
    isDuplicatedUsernameRequest,
    changeProfileImgRequest,
    withdrawRequest,
    changeWeeklyRunRequest,
    changeCurrentRunRequest,
} from "./accountApi";

export const getPrincipal = async () => {
    const result = await getPrincipalRequest();
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getUserByUserId = async (userId) => {
    const result = await getUserByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeUsername = async (data) => {
    const result = await changeUsernameRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const isDuplicatedUsername = async (username) => {
    const result = await isDuplicatedUsernameRequest(username);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeAddress = async (data) => {
    const result = await changeAddressRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeBodyInfo = async (data) => {
    const result = await changeBodyInfoRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeProfileImg = async (data) => {
    const result = await changeProfileImgRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeWeeklyRun = async (data) => {
    const result = await changeWeeklyRunRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeCurrentRun = async (data) => {
    const result = await changeCurrentRunRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const withdraw = async () => {
    const result = await withdrawRequest();
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};