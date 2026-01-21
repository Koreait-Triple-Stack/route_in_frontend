import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function SmartScroll() {
    const location = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // 뒤로가기/앞으로가기는 브라우저 복원
        if (navType === "POP") return;

        const el = document.getElementById("app-scroll");
        if (el) el.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [location.key, navType]); // ✅ 이동할 때마다 실행

    return null;
}
