import { instance } from "../utils/instance";

export const addInBodyRequest = async (data) => {
    const response = await instance.post("/inbody/add", data);
    return response.data;
};

export const deleteInBodyRequest = async (data) => {
    const response = await instance.post("/inbody/delete", data);
    return response.data;
};

export const getInBodyListByUserIdRequest = async (userId) => {
    const response = await instance.get(`/inbody/list/${userId}`);
    return response.data;
};