import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
    timeout: 15000,
});

instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});
