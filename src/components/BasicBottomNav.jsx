import { Box } from "@mui/system";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FilterFramesOutlinedIcon from "@mui/icons-material/FilterFramesOutlined";
import { useLocation, useNavigate } from "react-router-dom";

function BasicBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const value = location.pathname;

    return (
        <Paper
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
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
                    icon={<NotificationsNoneOutlinedIcon />}
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
