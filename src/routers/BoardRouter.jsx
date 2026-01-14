import { Route, Routes } from "react-router-dom";
import WriteTypePage from "../pages/WriteTypePage/WriteTypePage";
import RunningWritePage from "../pages/RunningWritePage/RunningWritePage";
import RoutineWritePage from "../pages/RoutineWritePage/RoutineWritePage";
import BoardListPage from "../pages/BoardListPage/BoardListPage";

function BoardRouter() {
    return (
        <>
            <Routes>
                <Route path="/" element={<BoardListPage />} />
                <Route path="/write/type" element={<WriteTypePage />} />
                <Route path="/write/type/running" element={<RunningWritePage />} />
                <Route path="/write/type/routine" element={<RoutineWritePage />} />
            </Routes>
        </>
    );
}

export default BoardRouter;
