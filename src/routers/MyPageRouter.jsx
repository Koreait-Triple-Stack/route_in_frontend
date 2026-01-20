import React from "react";
import { Route, Routes } from "react-router-dom";
import MyPage from "../pages/Mypage/MyPage";
import InBodyPage from "../pages/InBody/InBodyPage";
import MyBoardListPage from "../pages/MyBoardListPage/MyBoardListPage";
import CourseListPage from "../pages/CourseListPage/CourseListPage";

function MyPageRouter() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MyPage />} />
                <Route path="/inBody" element={<InBodyPage />} />
                <Route path="/boardList" element={<MyBoardListPage />} />
                <Route path="/courseList" element={<CourseListPage />} />
            </Routes>
        </>
    );
}

export default MyPageRouter;
