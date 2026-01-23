import {
    Box,
    Collapse,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import ProfileHeader from "./ProfileHeader";
import FollowStats from "./FollowStats";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HeightOutlinedIcon from "@mui/icons-material/HeightOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export default function ProfileCard({
    user,
    open,
    onToggleOpen,
    onNavigate,
    onSetActiveView,
    onLogout,
    renderOverlayContent,
}) {
    const itemSx = {
        px: 2,
        py: 1.2,
        "& .MuiListItemIcon-root": { minWidth: 40, color: "text.secondary" },
        "&:hover": { bgcolor: "action.hover" },
        borderRadius: 1.5,
        mx: 1,
        my: 0.5,
    };

    const subItemSx = {
        ...itemSx,
        pl: 4, // ✅ 들여쓰기만
        bgcolor: "transparent", // ✅ 회색 제거
        "&:hover": { bgcolor: "action.hover" },
    };

    return (
        <List
            sx={{
                position: "relative",
                width: "100%",
                bgcolor: "background.paper",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
            component="nav"
            aria-labelledby="profile"
            subheader={
                <ListSubheader
                    component="div"
                    id="profile"
                    sx={{
                        bgcolor: "transparent",
                        py: 1.3,
                        px: 3,
                        fontSize: 14,
                        fontWeight: 700,
                        color: "text.primary",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}>
                    마이 프로필
                </ListSubheader>
            }>
            {renderOverlayContent?.()}

            <ProfileHeader user={user} />

            <FollowStats
                followerCnt={user?.followerCnt}
                followingCnt={user?.followingCnt}
                onFollower={() => onNavigate("/mypage/follower")}
                onFollowing={() => onNavigate("/mypage/following")}
            />

            <Divider />

            <ListItemButton
                sx={itemSx}
                onClick={() => onNavigate("/mypage/inbody")}>
                <ListItemIcon>
                    <MonitorHeartOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="인바디 기록 추가/삭제" />
            </ListItemButton>

            <ListItemButton
                sx={itemSx}
                onClick={() => onNavigate("/mypage/board")}>
                <ListItemIcon>
                    <ArticleOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="작성한 게시물 관리" />
            </ListItemButton>

            <ListItemButton
                sx={itemSx}
                onClick={() => onNavigate("/mypage/course")}>
                <ListItemIcon>
                    <RouteOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="나만의 코스 수정" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton sx={itemSx} onClick={onToggleOpen}>
                <ListItemIcon>
                    <ManageAccountsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="개인정보 수정" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ px: 1 }}>
                    <ListItemButton
                        sx={subItemSx}
                        onClick={() => onSetActiveView("username")}>
                        <ListItemIcon>
                            <BadgeOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="닉네임 변경" />
                    </ListItemButton>

                    <ListItemButton
                        sx={subItemSx}
                        onClick={() => onSetActiveView("address")}>
                        <ListItemIcon>
                            <HomeOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="주소 변경" />
                    </ListItemButton>

                    <ListItemButton
                        sx={subItemSx}
                        onClick={() => onSetActiveView("bodyInfo")}>
                        <ListItemIcon>
                            <HeightOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="키/몸무게 변경" />
                    </ListItemButton>

                    <ListItemButton
                        sx={subItemSx}
                        onClick={() => onSetActiveView("withdraw")}>
                        <ListItemIcon>
                            <PersonOffOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="회원 탈퇴" />
                    </ListItemButton>
                </List>
            </Collapse>

            <Divider sx={{ my: 1 }} />

            <ListItemButton
                sx={{
                    ...itemSx,
                    "& .MuiListItemIcon-root": {
                        minWidth: 40,
                        color: "error.main",
                    },
                    "& .MuiListItemText-primary": {
                        color: "error.main",
                        fontWeight: 700,
                    },
                    "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
                }}
                onClick={onLogout}>
                <ListItemIcon>
                    <LogoutOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="로그아웃" />
            </ListItemButton>
        </List>
    );
}
