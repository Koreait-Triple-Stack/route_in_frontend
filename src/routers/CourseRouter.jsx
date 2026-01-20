import { Route, Routes } from "react-router-dom";
import CourseAdd from "../components/Course/CourseAdd";
import CourseDetail from "../components/Course/CourseDetail";
import CourseEdit from "../components/Course/CourseEdit";

function CourseRouter() {
    return <Routes>
        <Route path="/add" element={<CourseAdd />} />
        <Route path="/detail" element={<CourseDetail />} />
        <Route path="/edit/:courseId" element={<CourseEdit />} />
    </Routes>;
}

export default CourseRouter;
 