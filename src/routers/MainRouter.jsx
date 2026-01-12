import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/MainPage/MainPage";
import MyPage from "../pages/Mypage/MyPage";
import OAuth2Router from "./OAuth2Router";
import LandingPage from "../pages/LandingPage/LandingPage";
import { usePrincipalState } from "../store/usePrincipalState";


const RootRoute = () => {
  const { isLoggedIn } = usePrincipalState();
  return isLoggedIn ? <MainPage /> : <LandingPage />;
};

function MainRouter() {
    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/oauth2/*" element={<OAuth2Router />} />
                    <Route path="/aaa" element={<MainPage />} />
                </Routes>
            </Layout>
        </>
    );
}

export default MainRouter;
