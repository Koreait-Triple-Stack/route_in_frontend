import { instance } from "../utils/instance";

export const oAuth2SignupRequest = async (data) => {
    return await instance.post("/oauth2/signup", data);
};

export const oAuth2SigninRequest = async (data) => {
    return await instance.get("/oauth2/signin", data);
};