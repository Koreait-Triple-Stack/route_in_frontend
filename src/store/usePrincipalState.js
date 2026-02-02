import { create } from "zustand";

export const usePrincipalState = create((set, get) => ({
    isLoggedIn: false,
    principal: null,
    loading: true,
    unreadCount: 0,
    login: (userData) =>
        set({ isLoggedIn: true, principal: userData, loading: false }),
    logout: () => {
        localStorage.removeItem("AccessToken");
        set({ isLoggedIn: false, principal: null, loading: false });
        window.location.href = "/oauth2/signin";
    },
    setLoading: (loading) =>
        set({
            loading: loading,
        }),

    // 출석 다시 안띄우게 하기
    AttendanceChecked: () =>
        set((state) =>
            state.principal
                ? { principal: { ...state.principal, checked: false } }
                : {},
        ),
}));
