import { instance } from "../utils/instance";

export const getUserByUserIdRequest = async (userId) => {
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
    const response = await instance.get(`/user/account/userId/${userId}`);
    return response;
};

export const getPrincipal = async () => {
    instance.interceptors.request.use((config) => {
        const accessToken = localStorage.getItem("AccessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });
    try {
        const response = await instance.get("/user/account/principal");
        return response;
    } catch (error) {
        return error.response;
    }
};
