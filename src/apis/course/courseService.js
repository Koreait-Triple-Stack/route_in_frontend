import {
    addCourseRequest,
    getCourseByBoardIdRequest,
    getCourseFavoriteByUserIdRequest,
    getCourseListByUserIdRequest,
    updateCourseRequest,
} from "./courseApi";

export const addCourse = async (data) => {
    const result = await addCourseRequest(data);
    console.log(result)
    if (result.data.status === "failed") throw new Error(result.message ?? "저장 실패")
    return result.data.data;
};

export const getCourseByBoardId = async (boardId) => {
    const result = await getCourseByBoardIdRequest(boardId);
    if (result.data.status === "failed")
        throw new Error(result.message ?? "조회 실패");
    return result.data.data;
};

export const getCourseListByUserId = async (userId) => {
    const result = await getCourseListByUserIdRequest(userId);
    if (result.data.status === "failed")
        throw new Error(result.message ?? "조회 실패");
    return result.data.data;
};

export const getCourseFavoriteByUserId = async (userId) => {
    const result = await getCourseFavoriteByUserIdRequest(userId);
    if (result.data.status === "failed")
        throw new Error(result.message ?? "조회 실패");
    return result.data.data;
};

export const updateCourse = async (data) => {
    const result = await updateCourseRequest(data);
    if (result.data.status === "failed")
        throw new Error(result.message ?? "조회 실패");
    return result.data.data;
};
