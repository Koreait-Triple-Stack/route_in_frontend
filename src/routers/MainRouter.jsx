import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import MainPage from "../pages/MainPage/MainPage";
import OAuth2Router from "./OAuth2Router";
import LandingPage from "../pages/LandingPage/LandingPage";
import { usePrincipalState } from "../store/usePrincipalState";
import NotificationPage from "../pages/NotificationPage/NotificationPage";
import { useQuery } from "@tanstack/react-query";
import BoardRouter from "./BoardRouter";
import MapView from "../pages/MapView";
import MyPageRouter from "./MyPageRouter";
import CourseRouter from "./CourseRouter";
import { getPrincipal } from "../apis/account/accountService";

const RootRoute = () => {
    const { isLoggedIn } = usePrincipalState();
    return isLoggedIn ? <MainPage /> : <LandingPage />;
};

function MainRouter() {
    const accessToken = localStorage.getItem("AccessToken");
    const { principal, loading, login, logout, setLoading } = usePrincipalState();
    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getPrincipal"],
        queryFn: () => getPrincipal(),
        staleTime: 30000,
    });
    useEffect(() => {
        if (!isLoading && !error) {
            login(response.data);
        }
    }, [response, login]);

    if (isLoading) return <div>로딩중</div>;
    if (error) return <div>error.message</div>;

    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/board/*" element={<BoardRouter />} />
                    <Route path="/notification" element={<NotificationPage />} />
                    <Route path="/mypage/*" element={<MyPageRouter />} />
                    <Route path="/oauth2/*" element={<OAuth2Router />} />
                    <Route path="/aaa" element={<MainPage />} />
                    <Route path="/map" element={<MapView />} />
                    <Route path="/course/*" element={<CourseRouter />} />
                </Routes>
            </Layout>
        </>
    );
}

export default MainRouter;
