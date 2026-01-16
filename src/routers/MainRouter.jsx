import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import MainPage from "../pages/MainPage/MainPage";
import OAuth2Router from "./OAuth2Router";
import LandingPage from "../pages/LandingPage/LandingPage";
import { usePrincipalState } from "../store/usePrincipalState";
import NotificationPage from "../pages/NotificationPage/NotificationPage";
import BoardRouter from "./BoardRouter";
import MapView from "../pages/MapView";
import MyPageRouter from "./MyPageRouter";
import CourseRouter from "./CourseRouter";
import ProtectedRouter from "./ProtectedRouter";
import { useQuery } from "@tanstack/react-query";
import { getPrincipal } from "../apis/account/accountService";

const RootRoute = () => {
    const { isLoggedIn } = usePrincipalState();
    return isLoggedIn ? <MainPage /> : <LandingPage />;
};

function MainRouter() {
    const { login, setLoading } = usePrincipalState();
    const token = localStorage.getItem("AccessToken");
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

    useEffect(() => {
        if (error) {
            localStorage.removeItem("AccessToken");
            setLoading(false);
            // window.location.href = "/oauth2/signin"; // 필요하면
        }
    }, [error, setLoading]);

    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/oauth2/*" element={<OAuth2Router />} />

                    <Route
                        path="/board/*"
                        element={
                            <ProtectedRouter>
                                <BoardRouter />
                            </ProtectedRouter>
                        }
                    />
                    <Route
                        path="/notification"
                        element={
                            <ProtectedRouter>
                                <NotificationPage />
                            </ProtectedRouter>
                        }
                    />
                    <Route
                        path="/mypage/*"
                        element={
                            <ProtectedRouter>
                                <MyPageRouter />
                            </ProtectedRouter>
                        }
                    />

                    <Route path="/map" element={<MapView />} />
                    <Route path="/course/*" element={<CourseRouter />} />
                </Routes>
            </Layout>
        </>
    );
}

export default MainRouter;
