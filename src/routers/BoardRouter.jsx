// import { Route, Routes } from "react-router-dom";
// import WriteTypePage from "../pages/WriteTypePage/WriteTypePage";
// import RunningWritePage from "../pages/RunningWritePage/RunningWritePage";
// import RoutineWritePage from "../pages/RoutineWritePage/RoutineWritePage";
// import BoardListPage from "../pages/BoardListPage/BoardListPage";
// import CourseDetailPage from "../pages/CourseDetailPage/CourseDetailPage";
// import RoutineDetailPage from "../pages/RoutineDetailPage/RoutineDetailPage";
// import BoardWritePage from "../pages/BoardWritePage/BoardWritePage";

// function BoardRouter() {
//   return (
//     <>
//       <Routes>
//         <Route path="/" element={<BoardListPage />} />

//         <Route path="/board/write/:type" element={<BoardWritePage />} />
//         <Route path="/board/:boardId" element={<RoutineDetailPage />} />
//         {/* 작성페이지 -> BoardWritePage
//         상세페이지 -> BoardDetailPage */}

//         {/* <Route path="/write/type/running" element={<RunningWritePage />} /> */}
//         {/* <Route path="/write/type/routine" element={<RoutineWritePage />} />
//         <Route path="/board/detail/course" element={<CourseDetailPage />} /> */}
//       </Routes>
//     </>

//   );
// }

// export default BoardRouter;

// routes/BoardRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import BoardListPage from "../pages/BoardListPage/BoardListPage";
import BoardWritePage from "../pages/BoardWritePage/BoardWritePage";
import BoardDetailPage from "../pages/BoardDetailPage/BoardDetailPage";

// 러닝 상세가 따로 있으면 추가
// import CourseDetailPage from "../pages/CourseDetailPage/CourseDetailPage";

export default function BoardRouter() {
  return (
    <Routes>
      {/* /board */}
      <Route index element={<BoardListPage />} />

      {/* /board/write/routine , /board/write/running */}
      <Route path="write/:type" element={<BoardWritePage />} />

      {/* /board/123 */}
      <Route path=":type/:boardId" element={<BoardDetailPage />} />

      <Route path="*" element={<div>Board 404</div>} />
    </Routes>
  );
}
