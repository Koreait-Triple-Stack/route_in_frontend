import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import MainPage from "../pages/MainPage";
import MyPage from "../pages/MyPage";
import OAuth2Router from "./OAuth2Router";
import LandingPage from "../pages/LandingPage";
import { usePrincipalState } from "../store/usePrincipalState";
import BoardListPage from "../pages/BoardListPage";
import NotificationPage from "../pages/NotificationPage";
import { getPrincipal } from "../apis/account/accountApi";
import { useQuery } from "@tanstack/react-query";

const RootRoute = () => {
  const { isLoggedIn } = usePrincipalState();
  return isLoggedIn ? <MainPage /> : <LandingPage />;
};

function MainRouter() {
    const accessToken = localStorage.getItem("AccessToken");
    const { principal, loading, login, logout, setLoading } = usePrincipalState();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["getPrincipal"],
        queryFn: getPrincipal,
        refetch: 1,
        enabled: !!accessToken,
    });
    useEffect(() => {
        if (data?.data.status === "success") {
            login(data?.data.data);
        }
    }, [data, login]);
    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/board" element={<BoardListPage />} />
                    <Route path="/board/*" element={<BoardRouter />} />
                    <Route path="/notification" element={<NotificationPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/oauth2/*" element={<OAuth2Router />} />
                    <Route path="/aaa" element={<MainPage />} />
                </Routes>
            </Layout>
        </>
    );
}

export default MainRouter;
