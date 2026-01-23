import React from "react";
import { getFollowingUserList } from "../../apis/follow/followService";
import FollowUserList from "./FollowUserList";


function FollowingListPage() {
  return (
    <FollowUserList
      title="FollowingList"
      queryKeyPrefix="getFollowingUserList"
      queryFn={getFollowingUserList}
      emptyText="Following이 없습니다."
      mode="followings"
    />
  );
}

export default FollowingListPage;
