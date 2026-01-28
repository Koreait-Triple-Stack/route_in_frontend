import { create } from "zustand";

export const useChatUiState = create((set) => ({
    activeRoomId: null,
    setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),
}));
