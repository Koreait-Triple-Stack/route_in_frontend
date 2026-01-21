import React from "react";
import { Route, Routes } from "react-router-dom";
import MyPage from "../pages/Mypage/MyPage";
import InBodyPage from "../pages/InBody/InBodyPage";
import MyBoardListPage from "../pages/MyBoardListPage/MyBoardListPage";
import CourseListPage from "../pages/CourseListPage/CourseListPage";
import FollowerListPage from "../pages/FollowerListPage/FollowerListPage";
import FollowingListPage from "../pages/FollowingListPage/FollowingListPage";

function MyPageRouter() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MyPage />} />
                <Route path="/inbody" element={<InBodyPage />} />
                <Route path="/board" element={<MyBoardListPage />} />
                <Route path="/course" element={<CourseListPage />} />
                <Route path="/follower" element={<FollowerListPage />} />
                <Route path="/following" element={<FollowingListPage />} />
            </Routes>
        </>
    );
}

export default MyPageRouter;
