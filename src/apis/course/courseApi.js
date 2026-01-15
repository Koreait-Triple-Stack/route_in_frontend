import { instance } from "../utils/instance";

export const addCourseRequest = async (data) => {
    return instance.post("/course/add", data);
};

export const getCourseRequest = async (courseId) => {
    return await instance.get(`/course/get/${courseId}`);
};

export const updateCourseRequest = async (courseId, data) => {
    return await instance.post(`/course/update/${courseId}`, data);
};