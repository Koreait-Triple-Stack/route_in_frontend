import Avatar from "@mui/material/Avatar";
import React from "react";
import { useNavigate } from "react-router-dom";
function UserAvatarLink({
  userId,
  src,
  alt = "profile",
  size = 36,
  sx,
  stopPropagation = true,
  disabled = false,
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (stopPropagation) e.stopPropagation();
    if (disabled) return;
    if (!userId) return;
    navigate(`/user/${userId}`);
  };

  return (
    <Avatar
      src={src ?? undefined}
      alt={alt}
      onClick={handleClick}
      sx={{
        width: size,
        height: size,
        cursor: disabled || !userId ? "default" : "pointer",
        ...sx,
      }}
    />
  );
}
export default UserAvatarLink;
