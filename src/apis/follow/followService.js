import {
  getFollowerUserListRequest,
  getFollowingUserListRequest,
  getFollowStatusRequest,
  changeFollowRequest,
} from "./followApi";

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

// 팔로우 상태 조회 true/false로 받기
export const getFollowStatus = async ({ followerUserId, followingUserId }) => {
  const result = await getFollowStatusRequest(followerUserId, followingUserId);
  if (result.data.status !== "success") throw new Error(result.data.message);
  return result.data;
};

// 팔로우 토글 현재 상태 확인
export const changeFollow = async ({
  followerUserId,
  followingUserId,
  isFollowing,
}) => {
  const result = await changeFollowRequest({
    followerUserId,
    followingUserId,
    isFollowing,
  });
  if (result.data.status !== "success") throw new Error(result.data.message);
  return result.data;
};
