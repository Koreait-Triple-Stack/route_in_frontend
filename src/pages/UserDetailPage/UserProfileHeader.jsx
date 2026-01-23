import React from "react";
import { Box, Typography } from "@mui/material";
import FollowButton from "../../components/FollowButton";
import FollowStats from "../Mypage/FollowStats";

export default function UserProfileHeader({
  user,
  profileSrc,
  city,
  district,
  myUserId,
  profileUserId,
  enabledFollow,
  followerCnt,
  followingCnt,
  onFollower,
  onFollowing,
}) {
  return (
    <>
      {/* Profile */}
      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.100",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {profileSrc ? (
              <Box
                component="img"
                src={profileSrc}
                alt="profile"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography sx={{ fontWeight: 800, color: "text.secondary" }}>
                profile
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 0.3,
            }}
          >
            <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
              {user?.username ?? "-"}
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.gender ?? "-"} • {city} {district}
            </Typography>

            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {user?.height ?? "-"}cm / {user?.weight ?? "-"}kg
            </Typography>
          </Box>
        </Box>

        <FollowButton
          followerUserId={myUserId}
          followingUserId={profileUserId}
          enabled={enabledFollow}
          sx={{ borderRadius: 2, fontWeight: 900, whiteSpace: "nowrap" }}
        />
      </Box>

      {/* Follow stats */}
      <FollowStats
        followingCnt={followingCnt}
        followerCnt={followerCnt}
        onFollower={onFollower}
        onFollowing={onFollowing}
      />
    </>
  );
}
