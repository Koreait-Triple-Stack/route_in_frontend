import { Route, Routes } from "react-router-dom";
import WriteTypePage from "../pages/WriteTypePage";
import RunningWritePage from "../pages/RunningWritePage";
import RoutineWritePage from "../pages/RoutineWritePage";

function BoardRouter() {
  return (
    <>
      <Routes>
        <Route index element={<WriteTypePage />} />
        <Route path="list" element={<WriteTypePage />} />
        <Route path="running" element={<RunningWritePage />} />
        <Route path="routine" element={<RoutineWritePage />} />
      </Routes>
    </>
  );
}

export default BoardRouter;
