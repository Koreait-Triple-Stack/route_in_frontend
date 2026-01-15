import { addCourseRequest, getCourseByBoardIdRequest, getCourseFavoriteByUserIdRequest, getCourseListByUserIdRequest, updateCourseRequest } from "./courseApi";

export const addCourse = async (data) => {
    try {
        const res = await addCourseRequest(data);
        if (res.data.status === "success") {
            return { ok: true, data: res.data };
        } else if (res.data.status === "failed") {
            throw new Error({
                message: "요청 실패",
                response: {
                    status: 400,
                    data: {message: "요청 실패"},
                }
            });
        }
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

export const getCourseByBoardId = async (boardId) => {
    try {
        const res = await getCourseByBoardIdRequest(boardId);
        if (res.data.status === "success") {
            return { ok: true, data: res.data };
        } else if (res.data.status === "failed") {
            throw new Error({
                message: "요청 실패",
                response: {
                    status: 400,
                    data: { message: "요청 실패" },
                },
            });
        }
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

export const getCourseListByUserId = async (userId) => {
    try {
        const res = await getCourseListByUserIdRequest(userId);
        if (res.data.status === "success") {
            return { ok: true, data: res.data };
        } else if (res.data.status === "failed") {
            throw new Error({
                message: "요청 실패",
                response: {
                    status: 400,
                    data: { message: "요청 실패" },
                },
            });
        }
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

export const getCourseFavoriteByUserId = async (userId) => {
    try {
        const res = await getCourseFavoriteByUserIdRequest(userId);
        if (res.data.status === "success") {
            return { ok: true, data: res.data };
        } else if (res.data.status === "failed") {
            throw new Error({
                message: "요청 실패",
                response: {
                    status: 400,
                    data: { message: "요청 실패" },
                },
            });
        }
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

export const updateCourse = async (data) => {
    try {
        const res = await updateCourseRequest(data);
        if (res.data.status === "success") {
            return { ok: true, data: res.data };
        } else if (res.data.status === "failed") {
            throw new Error({
                message: "요청 실패",
                response: {
                    status: 400,
                    data: { message: "요청 실패" },
                },
            });
        }
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