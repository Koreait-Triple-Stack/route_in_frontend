import Avatar from "@mui/material/Avatar";
import React from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../store/usePrincipalState";
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
    const { principal } = usePrincipalState();

    const myId = Number(principal?.userId ?? 0);
    const targetId = Number(userId ?? 0);

    const handleClick = (e) => {
        if (stopPropagation) e.stopPropagation();
        if (disabled || !targetId) return;

        navigate(targetId === myId ? "/mypage" : `/user/${targetId}`);
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
