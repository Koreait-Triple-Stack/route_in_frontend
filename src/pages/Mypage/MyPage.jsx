import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";

import AddressForm from "./AddressForm";
import UsernameForm from "./UsernameForm";
import BodyInfoForm from "./BodyInfoForm";
import OverlayWrapper from "./OverlayWrapper";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DescriptionIcon from "@mui/icons-material/Description";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { Box, Container, Typography, Collapse } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import DraftsIcon from "@mui/icons-material/Drafts";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserByUserIdRequest } from "../../apis/account/accountApi";
import { getFollowerUserListRequest, getFollowingUserListRequest } from "../../apis/follow/followApi";

function MyPage() {
    const navigate = useNavigate();
    const { logout, principal } = usePrincipalState();
    const { data: response, isLoading } = useQuery({
        queryKey: ["getUserByUserId", principal?.userId],
        queryFn: () => getUserByUserIdRequest(principal?.userId),
        staleTime: 30000,
    });

    const user = response?.data?.data;

    const { data: followerUser } = useQuery({
        queryKey: ["getFollowerUserList", principal?.userId],
        queryFn: () => getFollowerUserListRequest(principal?.userId),
        staleTime: 30000,
    });

    const { data: followingUser } = useQuery({
        queryKey: ["getFollowingUserList", principal?.userId],
        queryFn: () => getFollowingUserListRequest(principal?.userId),
        staleTime: 30000,
    });

    const [activeView, setActiveView] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClick = () => setOpen(!open);
    const handleCloseOverlay = () => setActiveView(null);

    const renderOverlayContent = () => {
        if (!activeView) return null;

        const commonProps = {
            userId: user?.userId,
            onClose: handleCloseOverlay,
        };

        switch (activeView) {
            case "username":
                return <UsernameForm {...commonProps} />;
            case "address":
                return <AddressForm {...commonProps} />;
            case "bodyInfo":
                return <BodyInfoForm {...commonProps} />;
            case "withdraw":
                return (
                    <OverlayWrapper title="회원 탈퇴" onClose={handleCloseOverlay}>
                        <Typography>정말 탈퇴하시겠습니까?</Typography>
                    </OverlayWrapper>
                );
            default:
                return null;
        }
    };

    if (isLoading) return <div>로딩중...</div>;

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 56, // ✅ 네비 높이만큼 제외
                display: "flex",
                justifyContent: "center",
                px: 2,
                bgcolor: "background.default",
            }}
        >
            <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 500 }}>
                <List
                    sx={{
                        position: "relative",
                        width: "100%",
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        border: "1px solid #dbdbdb",
                        boxSizing: "border-box",
                        borderRadius: "14px",
                    }}
                    component="nav"
                    aria-labelledby="profile"
                    subheader={
                        <ListSubheader component="div" id="profile">
                            마이 프로필
                        </ListSubheader>
                    }
                >
                    {renderOverlayContent()}

                    <Box
                        sx={{
                            padding: "0 0 10px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <Box
                            component="img"
                            src="https://firebasestorage.googleapis.com/v0/b/board-study-26e00.firebasestorage.app/o/profile-img%2F40aaf171-5eae-4e81-96af-a89730616960_jpeg?alt=media&token=86b09376-18b3-49a9-881d-2b5ae5a728eb"
                            sx={{
                                width: 64,
                                height: 64,
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="h6">{user?.username}</Typography>
                            <Typography variant="body2">
                                {user?.gender} • {user?.address?.baseAddress}
                            </Typography>
                            <Typography variant="caption">
                                {user?.height}cm / {user?.weight}kg
                            </Typography>
                            <Typography variant="body2">
                                {/* follower : {followerUser.data.data.length} / following : {followingUser.data.data.length} */}
                            </Typography>
                        </Box>
                    </Box>

                    <ListItemButton onClick={() => navigate("/myPage/inBody")}>
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>
                        <ListItemText primary="인바디 기록 추가/삭제" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate("/myPage/boardList")}>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="작성한 게시물 관리" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate("/myPage/courseList")}>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="나만의 코스 수정" />
                    </ListItemButton>

                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="개인정보 수정" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => setActiveView("username")}>
                                <ListItemIcon>
                                    <StarBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="닉네임 변경" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => setActiveView("address")}>
                                <ListItemIcon>
                                    <StarBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="주소 변경" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => setActiveView("bodyInfo")}>
                                <ListItemIcon>
                                    <StarBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="키/몸무게 변경" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => setActiveView("withdraw")}>
                                <ListItemIcon>
                                    <StarBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="회원 탈퇴" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    <ListItemButton onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="로그아웃" />
                    </ListItemButton>
                </List>
            </Container>
        </Box>
    );
}

export default MyPage;
