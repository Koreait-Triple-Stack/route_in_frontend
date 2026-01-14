import { instance } from "../utils/instance";

export const addCourseRequest = async (data) => {
    try {
        const response = await instance.post("/course/add", data);
        return response.data;
    } catch (error) {
        return error.response;
    }
};
