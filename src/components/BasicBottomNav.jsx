import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FilterFramesOutlinedIcon from "@mui/icons-material/FilterFramesOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { countUnreadNotificationByUserId } from "../apis/notification/notificationService";
import { usePrincipalState } from "../store/usePrincipalState";
import { useQuery } from "@tanstack/react-query";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { countUnreadChatByUserIdRequest } from "../apis/chat/chatApi";

function BasicBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const { data: notificationResp } = useQuery({
        queryFn: () => countUnreadNotificationByUserId(principal.userId),
        queryKey: ["countUnreadNotificationByUserId", principal?.userId],
        staleTime: 30000,
    });
    const { data: chatResp } = useQuery({
        queryFn: () => countUnreadChatByUserIdRequest(principal.userId),
        queryKey: ["countUnreadChatByUserIdRequest", principal?.userId],
    });

    const value = location.pathname;

    return (
        <Paper
            sx={{
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                height: 56,
                zIndex: (theme) => theme.zIndex.appBar,
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
                    label="게시판"
                    value="/board"
                    icon={<FilterFramesOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="채팅"
                    value="/chat"
                    icon={
                        <Badge
                            badgeContent={chatResp?.data}
                            color="error"
                            overlap="circular"
                            showZero={false}>
                            <ChatBubbleOutlineIcon />
                        </Badge>
                    }
                />
                <BottomNavigationAction
                    label="홈"
                    value="/"
                    icon={<HomeOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="알림"
                    value="/notification"
                    icon={
                        <Badge
                            badgeContent={notificationResp?.data}
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
