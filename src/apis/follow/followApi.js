import { instance } from "../utils/instance";

export const getFollowerUserListRequest = async (userId) => {
    return instance.get(`/follow/follower/${userId}`);
};

export const getFollowingUserListRequest = async (userId) => {
    return instance.get(`/follow/following/${userId}`);
};