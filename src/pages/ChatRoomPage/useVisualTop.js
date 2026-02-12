import { useEffect, useState } from "react";

export default function useVisualTop() {
    const [top, setTop] = useState(0);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const update = () => {
            setTop(vv.offsetTop || 0);
        };

        update();
        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);

        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
        };
    }, []);

    return top;
}