import { addCourseRequest, getCourseRequest, updateCourseRequest } from "./courseApi";

export const addCourse = async (payload) => {
    try {
        const res = await addCourseRequest(payload);
        return { ok: true, data: res.data };
    } catch (err) {
        return {
            ok: false,
            status: err?.response?.status,
            message:
                err?.response?.data?.message ??
                err?.message ??
                "저장에 실패했습니다",
        };
    }
};

export const getCourse = async (courseId) => {
    try {
        const res = await getCourseRequest(courseId);
        return { ok: true, data: res.data };
    } catch (err) {
        return {
            ok: false,
            status: err?.response?.status,
            message:
                err?.response?.data?.message ??
                err?.message ??
                "조회에 실패했습니다",
        };
    }
};

export const updateCourse = async (boardId) => {
    try {
        const res = await updateCourseRequest(boardId);
        return { ok: true, data: res.data };
    } catch (err) {
        return {
            ok: false,
            status: err?.response?.status,
            message:
                err?.response?.data?.message ??
                err?.message ??
                "조회에 실패했습니다",
        };
    }
};