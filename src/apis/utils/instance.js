import axios from "axios";
import { isJwtExpired } from "./jwt";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
    timeout: 15000,
    withCredentials: false,
});

instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken) {
        if (isJwtExpired(accessToken)) {
            localStorage.removeItem("AccessToken");
            return config;
        }

        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

instance.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;

        if (status === 401) {
            localStorage.removeItem("AccessToken");
        }

        return Promise.reject(err);
    },
);
