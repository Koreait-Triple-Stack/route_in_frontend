import React, { useState } from "react";
import MainRouter from "./routers/MainRouter";
import { useNotificationWS } from "./hooks/useNotificationWS";
import { usePrincipalState } from "./store/usePrincipalState";
import { useEffect } from "react";
import { getPrincipal } from "./apis/account/accountService";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/system";
import NotificationListener from "./components/NotificationListener";
import Loading from "./components/Loading";

function AppInner() {
    const token = localStorage.getItem("AccessToken");
    const { login, setLoading } = usePrincipalState();
    const {
        data: response,
        error,
        isLoading,
        isSuccess,
    } = useQuery({
        queryFn: getPrincipal,
        queryKey: ["getPrincipal", token],
        enabled: !!token,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (isSuccess) {
            login(response.data);
        } else if (!isLoading) {
            setLoading(false);
        }
    }, [isSuccess, isLoading, response, login, setLoading]);

    if (isLoading) return <Loading />;
    if (error) return <Box>{error}</Box>;

    return (
        <>
            <MainRouter />
            <NotificationListener />
        </>
    );
}

export default AppInner;
