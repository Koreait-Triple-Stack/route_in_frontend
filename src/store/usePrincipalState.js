import { create } from "zustand";

export const usePrincipalState = create((set) => ({
    isLoggedIn: false,
    principal: null,
    token: null,
    loading: true,

    login: (userData, token) => {
        localStorage.setItem("AccessToken", token);
        set({
            isLoggedIn: true,
            principal: userData,
            token,
            loading: false,
        });
    },

    logout: () => {
        localStorage.removeItem("AccessToken");
        set({
            isLoggedIn: false,
            principal: null,
            token: null,
            loading: false,
        });
        window.location.href = "/";
    },
}));

