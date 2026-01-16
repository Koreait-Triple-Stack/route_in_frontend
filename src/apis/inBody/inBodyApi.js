import { instance } from "../utils/instance";

export const addInBodyRequest = async (data) => {
    return await instance.post("/inbody/add", data);
};

export const deleteInBodyRequest = async (data) => {
    return await instance.post("/inbody/delete", data);
};

export const getInBodyListByUserIdRequest = async (userId) => {
    return await instance.get(`/inbody/list/${userId}`);
};