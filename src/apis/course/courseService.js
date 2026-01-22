import {
    addCourseRequest,
    changeCourseFavoriteRequest,
    deleteCourseRequest,
    getCourseByBoardIdRequest,
    getCourseFavoriteByUserIdRequest,
    getCourseListByUserIdRequest,
    updateCourseRequest,
} from "./courseApi";

export const addCourse = async (data) => {
    const result = await addCourseRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message)
    return result.data;
};

export const getCourseByBoardId = async (boardId) => {
    const result = await getCourseByBoardIdRequest(boardId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getCourseListByUserId = async (userId) => {
    const result = await getCourseListByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getCourseFavoriteByUserId = async (userId) => {
    const result = await getCourseFavoriteByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const updateCourse = async (data) => {
    const result = await updateCourseRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeCourseFavorite = async (courseId) => {
    const result = await changeCourseFavoriteRequest(courseId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const deleteCourse = async (courseId) => {
    const result = await deleteCourseRequest(courseId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};
