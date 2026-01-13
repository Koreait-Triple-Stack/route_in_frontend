import { create } from "zustand";

export const useExerciseTagStore = create((set) => ({
    selectedTagIds: [],

    toggleTag: (tagId) =>
        set((state) => ({
            selectedTagIds: state.selectedTagIds.includes(tagId)
                ? state.selectedTagIds.filter((id) => id !== tagId)
                : [...state.selectedTagIds, tagId],
        })),

    resetTags: () => set({ selectedTagIds: [] }),
}));
