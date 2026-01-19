import { Routes, Route } from "react-router-dom";
import BoardListPage from "../pages/BoardListPage/BoardListPage";
import BoardWritePage from "../pages/BoardWritePage/BoardWritePage";
import BoardDetailPage from "../pages/BoardDetailPage/BoardDetailPage";

export default function BoardRouter() {
    return (
        <Routes>
            <Route index element={<BoardListPage />} />
            <Route path="write/:type" element={<BoardWritePage />} />
            <Route path=":type/:boardId" element={<BoardDetailPage />} />
        </Routes>
    );
}
