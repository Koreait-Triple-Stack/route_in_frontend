import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/MainPage/MainPage";
import MyPage from "../pages/Mypage/MyPage";

function MainRouter() {
    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </Layout>
        </>
    );
}

export default MainRouter;
