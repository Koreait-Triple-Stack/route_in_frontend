import { instance } from "../utils/instance";

export const addInBodyRequest = async (data) => {
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
    const response = await instance.post("/inbody/add", data);
    return response;
};

export const deleteInBodyRequest = async (data) => {
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
    const response = await instance.post("/inbody/delete", data);
    return response;
};

export const getInBodyListByUserIdRequest = async (userId) => {
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
    const response = await instance.get(`/inbody/list/${userId}`);
    return response;
};