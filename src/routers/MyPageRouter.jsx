import React from "react";
import { Route, Routes } from "react-router-dom";
import MyPage from "../pages/Mypage/MyPage";
import InBodyPage from "../pages/InBody/InBodyPage";
import MyBoardListPage from "../pages/MyBoardListPage/MyBoardListPage";

function MyPageRouter() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MyPage />} />
                <Route path="/inBody" element={<InBodyPage />} />
                <Route path="/boardList" element={<MyBoardListPage />} />
            </Routes>
        </>
    );
}

export default MyPageRouter;
