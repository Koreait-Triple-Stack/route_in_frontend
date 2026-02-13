import React from "react";
import { getFollowingUserList } from "../../apis/follow/followService";
import FollowUserList from "./FollowUserList";
import FollowButton from "../../components/FollowButton";
import { usePrincipalState } from "../../store/usePrincipalState";

function FollowingListPage() {
    const { principal } = usePrincipalState();
    const myUserId = Number(principal?.userId ?? 0);

    return (
        <FollowUserList
            title="팔로잉 리스트"
            queryKeyPrefix="getFollowingUserList"
            queryFn={getFollowingUserList}
            emptyText="팔로잉이 없습니다."
            mode="followings"
            renderRight={(user) => (
                <FollowButton
                    followerUserId={myUserId}
                    followingUserId={Number(user?.userId ?? 0)}
                    enabled={myUserId > 0}
                />
            )}
        />
    );
}

export default FollowingListPage;
