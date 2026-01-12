import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/MainPage/MainPage";
import MyPage from "../pages/Mypage/MyPage";
import BoardListPage from "../pages/BoardListPage/BoardListPage";
import NotificationPage from "../pages/NotificationPage/NotificationPage";

function MainRouter() {
    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/board" element={<BoardListPage />} />
                    <Route path="/notification" element={<NotificationPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </Layout>
        </>
    );
}

export default MainRouter;
