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

export const getFollowStatus = async ({ followerUserId, followingUserId }) => {
  const result = await getFollowStatusRequest(followerUserId, followingUserId);
  if (result.data.status !== "success") throw new Error(result.data.message);
  return result.data;
};

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
