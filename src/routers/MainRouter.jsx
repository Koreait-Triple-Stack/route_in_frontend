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
import ProtectedRouter from "./ProtectedRouter";

const RootRoute = () => {
    const { isLoggedIn } = usePrincipalState();
    return isLoggedIn ? <MainPage /> : <LandingPage />;
};

function MainRouter() {
    const { login, setLoading } = usePrincipalState();

    useEffect(() => {
        const token = localStorage.getItem("AccessToken");

        if (token) {
            login({ token });
        } else {
            setLoading(false);
        }
    }, [login, setLoading]);

    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/oauth2/*" element={<OAuth2Router />} />

                    <Route path="/board/*" element={<BoardRouter />} />
                    <Route
                        path="/notification"
                        element={<NotificationPage />}
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
