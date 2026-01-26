import React from "react";
import { getFollowerUserList } from "../../apis/follow/followService";
import FollowUserList from "./FollowUserList";
import FollowButton from "../../components/FollowButton";
import { usePrincipalState } from "../../store/usePrincipalState";

function FollowerListPage() {
    const { principal } = usePrincipalState();
    const myUserId = Number(principal?.userId ?? 0);

    return (
        <FollowUserList
            title="팔로워 리스트"
            queryKeyPrefix="getFollowerUserList"
            queryFn={getFollowerUserList}
            emptyText="팔로워가 없습니다."
            mode="followers"
            renderRight={(user) => (
                <FollowButton
                    followerUserId={myUserId}
                    followingUserId={Number(user?.userId ?? 0)}
                    enabled={myUserId > 0}
                    sx={{
                        borderRadius: 2,
                        fontWeight: 900,
                        whiteSpace: "nowrap",
                        px: 1.5,
                        minWidth: 36,
                        height: 36,
                    }}
                />
            )}
        />
    );
}

export default FollowerListPage;
