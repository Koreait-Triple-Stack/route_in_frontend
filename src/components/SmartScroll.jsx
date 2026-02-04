import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function SmartScroll() {
    const location = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        if (navType === "POP") return;

        const el = document.getElementById("app-scroll");
        if (el) el.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [location.key, navType]);

    return null;
}
