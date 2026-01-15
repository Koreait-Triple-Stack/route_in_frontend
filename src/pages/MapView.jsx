import { use, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourseFavoriteByUserId } from "../apis/course/courseService";
import CourseDetail from "../components/Course/CourseDetail";

export default function MapView() {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        (async () => {
            setLoading(true)
            setError(null)

            const result = await getCourseFavoriteByUserId(20);

            setLoading(false)

            if (!result.ok) {
                alert("조회 실패");
                return;
            }

            setCourse(result?.data?.data ?? null);
        })();
    }, []);

    return !!course && <CourseDetail course={course} />;
}
