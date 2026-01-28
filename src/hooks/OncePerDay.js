import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function OncePerDay(userId) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const key = `calendar_popup_${userId}`;
        const today = dayjs().format("YYYY-MM-DD");

        if (localStorage.getItem(key) === today) return;

        localStorage.setItem(key, today);
        setOpen(true);
    }, [userId]);

    return { open, close: () => setOpen(false) };
}
