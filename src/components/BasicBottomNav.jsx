import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FilterFramesOutlinedIcon from "@mui/icons-material/FilterFramesOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotificationStore } from "../store/useNotificationStore";
import { Badge } from "@mui/material";

function BasicBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const unread = useNotificationStore((s) => s.unreadCount());

    const value = location.pathname;

    return (
        <Paper
            sx={{
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                // maxWidth: 600, // Container sm에 맞춰 조절 (sm이 600px)
                height: 56,
                zIndex: (theme) => theme.zIndex.appBar, // 위로 올리기
                pb: "env(safe-area-inset-bottom)",
            }}
            elevation={3}>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    navigate(newValue);
                }}
                showLabels>
                <BottomNavigationAction
                    label="홈"
                    value="/"
                    icon={<HomeOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="게시판"
                    value="/board"
                    icon={<FilterFramesOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="알림"
                    value="/notification"
                    icon={
                        <Badge
                            badgeContent={unread}
                            color="error"
                            overlap="circular"
                            showZero={false}>
                            <NotificationsNoneOutlinedIcon />
                        </Badge>
                    }
                />
                <BottomNavigationAction
                    label="마이"
                    value="/mypage"
                    icon={<PersonOutlineOutlinedIcon />}
                />
            </BottomNavigation>
        </Paper>
    );
}

export default BasicBottomNav;
