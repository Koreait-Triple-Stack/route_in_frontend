import { create } from "zustand";

export const useToastStore = create((set) => ({
    open: false,
    message: "",
    severity: "info",
    show: (message, severity = "info") =>
        set({ open: true, message, severity }),
    close: () => set({ open: false }),
}));
