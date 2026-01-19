import React from "react";
import { Routes, Route } from "react-router-dom";
import BoardListPage from "../pages/BoardListPage/BoardListPage";
import BoardWritePage from "../pages/BoardWritePage/BoardWritePage";
import BoardDetailPage from "../pages/BoardDetailPage/BoardDetailPage";


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
