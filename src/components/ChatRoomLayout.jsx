import { Box } from "@mui/system";
import { useEffect, useState } from "react";

export default function ChatRoomLayout({ children }) {
    const getVV = () => window.visualViewport;

    const [vvState, setVvState] = useState(() => {
        const vv = getVV();
        return {
            height: vv?.height ?? window.innerHeight,
            offsetTop: vv?.offsetTop ?? 0,
        };
    });

    useEffect(() => {
        const vv = getVV();
        if (!vv) return;

        let raf = 0;
        const update = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                setVvState({
                    height: vv.height,
                    offsetTop: vv.offsetTop,
                });
            });
        };

        update();
        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);
        return () => {
            cancelAnimationFrame(raf);
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
        };
    }, []);

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
        };
    }, []);

    return (
        <Box
            sx={{
                position: "fixed",
                left: 0,
                right: 0,
                top: 0,
                height: `${vvState.height}px`,
                transform: `translateY(${vvState.offsetTop}px)`,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                width: "100%",
                overscrollBehavior: "none",
            }}>
            {children}
        </Box>
    );
}
