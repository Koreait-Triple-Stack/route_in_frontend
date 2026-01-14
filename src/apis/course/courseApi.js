import { instance } from "../utils/instance";

export const addCourseRequest = async (data) => {
    return instance.post("/course/add", data);
};

export const getCourseListByUserRequest = async () => {
    return await instance.get("/course/get/user");
};