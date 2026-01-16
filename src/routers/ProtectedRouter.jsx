import React, { useEffect } from "react";
import { usePrincipalState } from "../store/usePrincipalState";
import { useLocation, useNavigate } from "react-router-dom";

function ProtectedRouter({ children }) {
    const { isLoggedIn, loading } = usePrincipalState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            navigate("/oauth2/signin", {
                replace: true,
                state: { from: location.pathname },
            });
        }
    }, [loading, isLoggedIn, navigate, location.pathname]);

    if (loading) {
        return <div style={{ padding: 16 }}>로그인 확인 중...</div>;
    }

    if (!isLoggedIn) {
        return null;
    }

    return children;
}

export default ProtectedRouter;
