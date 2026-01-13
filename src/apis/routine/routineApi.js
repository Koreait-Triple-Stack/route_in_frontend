import { instance } from "../utils/instance";

export const getRoutineByUserIdRequest = async (userId) => {
    instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("AccessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
    const response = await instance.get(`/routine/get/user/${userId}`);
    return response;
};