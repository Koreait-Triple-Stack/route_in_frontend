import { instance } from "../utils/instance";

export const addCourseRequest = async (data) => {
    return await instance.post("/course/add", data);
};

export const getCourseByBoardIdRequest = async (boardId) => {
    return await instance.get(`/course/get/board/${boardId}`);
};

export const getCourseListByUserIdRequest = async (userId) => {
    return await instance.get(`/course/get/user/${userId}`);
};

export const getCourseFavoriteByUserIdRequest = async (userId) => {
    return await instance.get(`/course/get/favorite/${userId}`);
};

export const updateCourseRequest = async (data) => {
    return await instance.post(`/course/update`, data);
};