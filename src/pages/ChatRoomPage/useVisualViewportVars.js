import { useEffect } from "react";

export default function useVisualViewportVars() {
    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const setVars = () => {
            document.documentElement.style.setProperty(
                "--vvh",
                `${vv.height}px`,
            );
            document.documentElement.style.setProperty(
                "--vvo",
                `${vv.offsetTop}px`,
            );

            const vvb = Math.max(
                0,
                window.innerHeight - vv.height - vv.offsetTop,
            );
            document.documentElement.style.setProperty("--vvb", `${vvb}px`);
        };

        vv.addEventListener("resize", setVars);
        vv.addEventListener("scroll", setVars);
        window.addEventListener("resize", setVars);

        setVars();

        return () => {
            vv.removeEventListener("resize", setVars);
            vv.removeEventListener("scroll", setVars);
            window.removeEventListener("resize", setVars);
        };
    }, []);
}
