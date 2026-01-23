import React from "react";
import { getFollowerUserList } from "../../apis/follow/followService";
import FollowUserList from "./FollowUserList";

function FollowerListPage() {
  return (
    <FollowUserList
      title="FollowerList"
      queryKeyPrefix="getFollowerUserList"
      queryFn={getFollowerUserList}
      emptyText="Follower가 없습니다."
      mode="followers"
    />
  );
}

export default FollowerListPage;
