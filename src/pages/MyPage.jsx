import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { Box, Container } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useState } from "react";
import DraftsIcon from "@mui/icons-material/Drafts";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Typography from "@mui/material/Typography";
import { usePrincipalState } from "../store/usePrincipalState";
import { useNavigate } from "react-router-dom";

function MyPage() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { isLoggedIn, logout, principal, loading } = usePrincipalState();

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = "/oauth2/signin";
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn || loading) {
        return <></>; 
    }

    return (
        <>
            <Container
                sx={{
                    padding: "20px 0",
                }}>
                <List
                    sx={{
                        width: "100%",
                        maxWidth: 360,
                        minWidth: 300,
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
                    }>
                    <Box
                        sx={{
                            padding: "0 0 10px 16px",
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            gap: "10px",
                            boxSizing: "border-box",
                        }}>
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
                            <Typography variant="h6">{principal?.username}</Typography>
                            <Typography variant="h8">
                                {principal?.gender} • {principal?.address?.baseAddress}
                            </Typography>
                            <Typography variant="h8">{principal?.height} / {principal?.weight}</Typography>
                        </Box>
                    </Box>

                    <ListItemButton>
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>
                        <ListItemText primary="인바디 기록 추가/삭제" />
                    </ListItemButton>
                    <ListItemButton>
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
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="닉네임 변경" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="주소 변경" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorderIcon />
                                </ListItemIcon>
                                <ListItemText primary="키/몸무게 변경" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }}>
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
        </>
    );
}

export default MyPage;
