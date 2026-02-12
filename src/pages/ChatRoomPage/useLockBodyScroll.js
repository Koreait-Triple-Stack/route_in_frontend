import { useEffect } from "react";

export default function useLockBodyScroll(locked, allowScrollRef) {
    useEffect(() => {
        if (!locked) return;

        const isIOS =
            /iP(hone|od|ad)/.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        const html = document.documentElement;
        const body = document.body;

        const prev = {
            htmlOverflow: html.style.overflow,
            bodyOverflow: body.style.overflow,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyWidth: body.style.width,
            bodyTouchAction: body.style.touchAction,
        };

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        body.style.touchAction = "none";

        if (!isIOS) {
            const scrollY = window.scrollY || window.pageYOffset;
            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.width = "100%";
            body.dataset.__lockScrollY = String(scrollY);
        }

        const onTouchMove = (e) => {
            const allowEl = allowScrollRef?.current;
            if (allowEl && allowEl.contains(e.target)) return;
            e.preventDefault();
        };

        if (isIOS) {
            document.addEventListener("touchmove", onTouchMove, {
                passive: false,
            });
        }

        return () => {
            if (isIOS) {
                document.removeEventListener("touchmove", onTouchMove);
            }

            html.style.overflow = prev.htmlOverflow;
            body.style.overflow = prev.bodyOverflow;
            body.style.position = prev.bodyPosition;
            body.style.top = prev.bodyTop;
            body.style.width = prev.bodyWidth;
            body.style.touchAction = prev.bodyTouchAction;

            if (!isIOS) {
                const y = Number(body.dataset.__lockScrollY || "0");
                delete body.dataset.__lockScrollY;
                window.scrollTo(0, y);
            }
        };
    }, [locked]);
}
