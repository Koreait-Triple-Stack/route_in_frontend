// src/routers/BoardRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import BoardListPage from "../pages/BoardListPage/BoardListPage";
import BoardWritePage from "../pages/BoardWritePage/BoardWritePage";
import BoardDetailPage from "../pages/BoardDetailPage/BoardDetailPage";
import BoardEditPage from "../pages/BoardEditPage/BoardEditPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

export default function BoardRouter() {
  return (
    <Routes>
      <Route index element={<BoardListPage />} />

      <Route path="write/:type" element={<BoardWritePage />} />

      <Route path="detail/:boardId" element={<BoardDetailPage />} />

      <Route path="edit" element={<BoardEditPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
