import { create } from "zustand";

export const useExerciseTagStore = create((set) => ({
    selectedTags: [],

    toggleTag: (tag) =>
        set((state) => {
            return {
                selectedTags: state.selectedTags.includes(tag)
                    ? state.selectedTags.filter((id) => id !== tag)
                    : [...state.selectedTags, tag],
            };
        }),

    resetTags: () => set({ selectedTags: [] }),
}));
