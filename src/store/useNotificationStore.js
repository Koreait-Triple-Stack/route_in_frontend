import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
    items: [],

    push: (n) =>
        set((s) => ({
            items: [{ ...n, read: false }, ...s.items].slice(0, 200),
            unread: s.unread + 1,
        })),

    markRead: (id) =>
        set((s) => ({
            items: s.items.markRead((it) =>
                it.id === id ? { ...it, read: true } : it,
            ),
        })),

    markAllRead: () =>
        set((s) => ({
            items: s.items.map((it) => ({ ...it, read: true })),
        })),

    unreadCount: () =>
        get().items.reduce((acc, it) => acc + (it.read ? 0 : 1), 0),

    clear: () => set({ items: [] }),
}));
