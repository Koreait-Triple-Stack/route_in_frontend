import { create } from "zustand";

export const usePrincipalState = create((set, get) => ({
    isLoggedIn: false,
    principal: null,
    token: null,
    loading: true,
    unreadCount: 0,

    login: (userData, token) => {
        localStorage.setItem("AccessToken", token);
        set({
            isLoggedIn: true,
            principal: userData,
            token: token,
            loading: false,
        });
    },

    logout: () => {
        localStorage.removeItem("AccessToken");
        set({ isLoggedIn: false, principal: null, loading: false });
        window.location.href = "/";
    },
    
    setLoading: (loading) =>
        set({
            loading: loading,
        }),

    AttendanceChecked: () =>
        set((state) =>
            state.principal
                ? { principal: { ...state.principal, checked: false } }
                : {},
        ),
}));
