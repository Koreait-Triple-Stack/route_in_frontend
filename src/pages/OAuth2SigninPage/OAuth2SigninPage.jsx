import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading";

const OAuth2SigninPage = () => {
    const [searchParams] = useSearchParams();
    const accessToken = searchParams.get("accessToken");

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("AccessToken", accessToken);
            window.location.href = "/main";
        }
    }, [accessToken]);

    return <Loading />;
};

export default OAuth2SigninPage;
