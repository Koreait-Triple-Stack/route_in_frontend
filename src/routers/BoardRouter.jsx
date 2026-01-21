// src/routers/BoardRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import BoardListPage from "../pages/BoardListPage/BoardListPage";
import BoardWritePage from "../pages/BoardWritePage/BoardWritePage";
import BoardDetailPage from "../pages/BoardDetailPage/BoardDetailPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

export default function BoardRouter() {
  return (
    <Routes>
      {/* /board */}
      <Route index element={<BoardListPage />} />

      {/* /board/write/routine , /board/write/running */}
      <Route path="write/:type" element={<BoardWritePage />} />

      {/* /board/routine/123 , /board/running/123 */}
      <Route path="detail/:boardId" element={<BoardDetailPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
