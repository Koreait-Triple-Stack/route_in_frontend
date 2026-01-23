import { instance } from "../utils/instance";

export const getPrincipalRequest = async () => {
    return await instance.get("/user/account/principal");
};

export const getUserByUserIdRequest = async (userId) => {
    return await instance.get(`/user/account/userId/${userId}`);
};

export const changeUsernameRequest = async (data) => {
    return await instance.post("/user/account/change/username", data);
};

export const isDuplicatedUsernameRequest = async (username) => {
    return await instance.get(`/user/account/duplicated/${username}`);
};

export const changeAddressRequest = async (data) => {
    return await instance.post("/user/account/address", data);
};

export const changeBodyInfoRequest = async (data) => {
    return await instance.post("/user/account/change/bodyInfo", data);
};

export const changeProfileImgRequest = async (data) => {
    return await instance.post("/user/account/change/profileImg", data);
};