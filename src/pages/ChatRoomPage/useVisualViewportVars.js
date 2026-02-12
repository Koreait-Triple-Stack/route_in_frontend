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
            const inset = Math.max(
                0,
                window.innerHeight - vv.height - vv.offsetTop,
            );
            document.documentElement.style.setProperty(
                "--keyboard-inset",
                `${inset}px`,
            );
        };

        vv.addEventListener("resize", setVars);
        vv.addEventListener("scroll", setVars);
        setVars();

        return () => {
            vv.removeEventListener("resize", setVars);
            vv.removeEventListener("scroll", setVars);
        };
    }, []);
}
