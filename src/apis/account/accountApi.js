import { instance } from "../utils/instance";

export const getPrincipal = async () => {
    try {
        const response = await instance.get("/user/account/principal");
        return response.data;
    } catch (error) {
        return error.response;
    }
};

export const getUserByUserIdRequest = async (userId) => {
    const response = await instance.get(`/user/account/userId/${userId}`);
    return response.data;
};

export const changeUsernameRequest = async (data) => {
    try {
        const response = await instance.post("/user/account/change/username", data);
        return response.data;
    } catch (error) {
        return error.response;
    }
};

export const changeAddressRequest = async (data) => {
    try {
        const response = await instance.post("/user/account/address", data);
        return response.data;
    } catch (error) {
        return error.response;
    }
};

export const changeBodyInfoRequest = async (data) => {
    try {
        const response = await instance.post("/user/account/change/bodyInfo", data);
        return response.data;
    } catch (error) {
        return error.response;
    }
};
