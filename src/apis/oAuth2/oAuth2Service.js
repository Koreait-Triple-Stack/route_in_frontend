import {
    oAuth2SignupRequest,
    oAuth2SigninRequest
} from "./oAuth2Api";

export const oAuth2Signup = async (data) => {
    const result = await oAuth2SignupRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const oAuth2Signin = async (data) => {
    const result = await oAuth2SigninRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};