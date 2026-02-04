import React, { useEffect } from "react";
import { usePrincipalState } from "../store/usePrincipalState";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

function ProtectedRouter({ children }) {
    const { isLoggedIn, loading } = usePrincipalState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            navigate("/", {
                replace: true,
                state: { from: location.pathname },
            });
        }
    }, [loading, isLoggedIn, navigate, location.pathname]);

    if (loading) {
        return <Loading />;
    }

    if (!isLoggedIn) {
        return null;
    }

    return children;
}

export default ProtectedRouter;
