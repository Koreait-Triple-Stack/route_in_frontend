import { Box } from "@mui/system";
import { useEffect, useState } from "react";

export default function ChatRoomLayout({ children }) {
    const [vh, setVh] = useState(
        () => window.visualViewport?.height ?? window.innerHeight,
    );

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const update = () => {
            const h = vv.height;
            requestAnimationFrame(() => setVh(h));
        };

        update();
        vv.addEventListener("resize", update);
        return () => vv.removeEventListener("resize", update);
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
                top: 0,
                left: 0,
                right: 0,
                height: `${vh}px`,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                overscrollBehavior: "none",
                overscrollBehaviorY: "none",
                width: "100%",
            }}>
            {children}
        </Box>
    );
}
