import { getFollowerUserListRequest, getFollowingUserListRequest } from "./followApi";

export const getFollowerUserList = async (userId) => {
    const result = await getFollowerUserListRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getFollowingUserList = async (userId) => {
    const result = await getFollowingUserListRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};