import { instance } from "../utils/instance";

export const getFollowerUserListRequest = async (userId) => {
  return instance.get(`/follow/follower/${userId}`);
};

export const getFollowingUserListRequest = async (userId) => {
  return instance.get(`/follow/following/${userId}`);
};

// 팔로우 토글
export const changeFollowUserListRequest = (userId) => {
  return instance.post(`/follow/change`, payload);
};

//팔로우 상태 조회
export const getFollowStatusRequest = (followerUserId, followingUserId) => {
  return instance.get(`/follow/status`, {
    params: { followerUserId, followingUserId },
  });
};

export const changeFollowRequest = ({
  followerUserId,
  followingUserId,
  isFollowing,
}) => {
  return instance.post("/follow/change", {
    followerUserId,
    followingUserId,
    isFollowing,
  });
};
