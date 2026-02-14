import { useRef } from "react";

export default function useKeyboardScrollShift(messageRef) {
    const restoreRef = useRef(null);
    const armedRestoreRef = useRef(false);

    const handleFocus = () => {
        const el = messageRef.current?._getScroller?.();
        const vv = window.visualViewport;
        if (!el || !vv) return;

        const gap = el.scrollHeight - (el.scrollTop + el.clientHeight);

        restoreRef.current = () => {
            const apply = () => {
                const e = messageRef.current?._getScroller?.();
                if (!e) return;
                const top = e.scrollHeight - e.clientHeight - gap;
                e.scrollTop = Math.max(0, top);
            };
            requestAnimationFrame(() => {
                apply();
                requestAnimationFrame(() => {
                    apply();
                    setTimeout(apply, 50);
                });
            });
        };

        armedRestoreRef.current = true;

        let prevVh = vv.height;
        let done = false;

        const onResize = () => {
            const nextVh = vv.height;
            const delta = prevVh - nextVh;
            prevVh = nextVh;

            if (delta > 0 && !done) {
                done = true;
                el.scrollTop += delta;
                vv.removeEventListener("resize", onResize);
            }
        };

        vv.addEventListener("resize", onResize);

        setTimeout(() => {
            vv.removeEventListener("resize", onResize);
        }, 800);
    };

    const handleBlur = () => {
        if (!armedRestoreRef.current) return;
        armedRestoreRef.current = false;
        restoreRef.current?.();
    };

    return { handleFocus, handleBlur };
}
