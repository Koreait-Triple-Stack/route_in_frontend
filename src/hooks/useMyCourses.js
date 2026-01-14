import { useCallback, useState } from "react";
import { getCourseListByUserRequest } from "../apis/course/courseApi";

export function useMyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("") 

    const refresh = useCallback(async () => {
        try {
            setLoading(true)
            setError("")
            const list = await getCourseListByUserRequest();
            setCourses(Array.isArray(list) ? list : [])
        } catch (e) {
            setError(e?.response?.data?.message ?? e?.message ?? "failed to load")
        } finally {
            setLoading(false)
        }
    })

    return { courses, loading, error, refresh, setCourses };
}