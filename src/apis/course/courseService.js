import { addCourseRequest } from "./courseApi"

export const addCourse = async (payload) => {
    try {
        const res = await addCourseRequest(payload);
        return {ok: true, data: res.data}
    } catch (err) {
        return {
            ok: false,
            status: err?.response?.status,
            message:
                err?.response?.data?.message ??
                err?.message ??
                "저장 중 오류가 발생했습니다.",
        }
    }
}