import { instance } from "../utils/instance";

export const oAuth2SignupRequest = async (data) => {
    try {
        const response = await instance.post("/oauth2/signup", data);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const oAuth2SigninRequest = async (data) => {
    try {
        const response = await instance.post("/oauth2/signin", data);
        return response;
    } catch (error) {
        return error.response;
    }
};