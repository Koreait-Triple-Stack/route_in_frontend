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

        const pinTop = () => {
            if (window.scrollY !== 0) window.scrollTo(0, 0);
        };

        pinTop();

        const vv = window.visualViewport;
        const onVV = () => pinTop();

        let savedScrollY = 0;
        if (!isIOS) {
            savedScrollY = window.scrollY || window.pageYOffset;
            body.style.position = "fixed";
            body.style.top = `-${savedScrollY}px`;
            body.style.width = "100%";
        }

        const onTouchMove = (e) => {
            const allowEl = allowScrollRef?.current;
            if (allowEl && allowEl.contains(e.target)) return;
            e.preventDefault();
        };

        const onScroll = () => pinTop();

        window.addEventListener("scroll", onScroll, { passive: true });
        vv?.addEventListener("resize", onVV);
        vv?.addEventListener("scroll", onVV);

        if (isIOS) {
            document.addEventListener("touchmove", onTouchMove, {
                passive: false,
            });
        }

        return () => {
            if (isIOS) {
                document.removeEventListener("touchmove", onTouchMove);
            }

            window.removeEventListener("scroll", onScroll);
            vv?.removeEventListener("resize", onVV);
            vv?.removeEventListener("scroll", onVV);

            html.style.overflow = prev.htmlOverflow;
            body.style.overflow = prev.bodyOverflow;
            body.style.position = prev.bodyPosition;
            body.style.top = prev.bodyTop;
            body.style.width = prev.bodyWidth;
            body.style.touchAction = prev.bodyTouchAction;

            if (!isIOS) {
                window.scrollTo(0, savedScrollY);
            }
        };
    }, [locked, allowScrollRef]);
}
