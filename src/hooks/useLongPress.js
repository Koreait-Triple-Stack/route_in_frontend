import { useRef, useCallback } from "react";

export function useLongPress({ onLongPress, onClick, delay = 450 } = {}) {
    const timerRef = useRef(null);
    const movedRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });

    const clear = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
    }, []);

    const start = useCallback(
        (e) => {
            movedRef.current = false;

            const p = "touches" in e ? e.touches[0] : e;
            startPosRef.current = { x: p.clientX, y: p.clientY };

            clear();
            timerRef.current = setTimeout(() => {
                timerRef.current = null;
                onLongPress?.(e);
            }, delay);
        },
        [clear, delay, onLongPress],
    );

    const move = useCallback(
        (e) => {
            if (!timerRef.current) return;

            const p = "touches" in e ? e.touches[0] : e;
            const dx = Math.abs(p.clientX - startPosRef.current.x);
            const dy = Math.abs(p.clientY - startPosRef.current.y);

            if (dx > 8 || dy > 8) {
                movedRef.current = true;
                clear();
            }
        },
        [clear],
    );

    const end = useCallback(
        (e) => {
            const hadTimer = !!timerRef.current;
            clear();

            if (hadTimer && !movedRef.current) {
                onClick?.(e);
            }
        },
        [clear, onClick],
    );

    const cancel = useCallback(() => {
        clear();
    }, [clear]);

    return {
        onTouchStart: start,
        onTouchMove: move,
        onTouchEnd: end,
        onTouchCancel: cancel,

        onMouseDown: start,
        onMouseMove: move,
        onMouseUp: end,
        onMouseLeave: cancel,
    };
}
