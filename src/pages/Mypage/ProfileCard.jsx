import {
    Collapse,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import FollowStats from "./FollowStats";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HeightOutlinedIcon from "@mui/icons-material/HeightOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ProfileHeader from "./ProfileHeader";

export default function ProfileCard({
    user,
    open,
    onToggleOpen,
    onNavigate,
    onSetActiveView,
    onLogout,
}) {
    const THEME = {
        primary: "#60A5FA",
        secondary: "#86EFAC",
        bgLight: "#F8FAFC",
        textMain: "#1E293B",
        textSub: "#94A3B8",
        divider: "#F1F5F9",
        error: "#F43F5E",
    };

    const iconBoxSx = (color) => ({
        minWidth: 40,
        height: 40,
        borderRadius: "12px",
        bgcolor: `${color}10`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 2,
        transition: "transform 0.2s",
        "& svg": { fontSize: 22, color: color },
    });

    const itemSx = {
        px: 3,
        py: 2,
        bgcolor: "white",
        "&:hover": {
            bgcolor: "#F1F5F9",
            "& .icon-box": { transform: "scale(1.1)" },
        },
        transition: "all 0.2s",
    };

    const subheaderSx = {
        px: 3,
        pt: 3,
        pb: 1,
        color: THEME.textSub,
        fontWeight: 800,
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
    };

    return (
        <Box>
            <Box
                sx={{
                    background:
                        "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(37, 99, 235, 0.15)",
                    position: "relative",
                    overflow: "hidden",
                    px: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(0,0,0,0.05))",
                        pointerEvents: "none",
                    },
                }}>
                <ProfileHeader user={user} />
                <FollowStats
                    user={user}
                    followerCnt={user?.followerCnt}
                    followingCnt={user?.followingCnt}
                    onFollower={() => onNavigate("/mypage/follower")}
                    onFollowing={() => onNavigate("/mypage/following")}
                />
            </Box>

            <Typography sx={subheaderSx}>나의 활동</Typography>
            <List
                disablePadding
                sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                    border: "1px solid",
                    borderColor: "divider",
                }}>
                <MenuLink
                    icon={<MonitorHeartOutlinedIcon />}
                    label="인바디 기록"
                    color={THEME.primary}
                    onClick={() => onNavigate("/mypage/inbody")}
                />
                <Divider sx={{ borderColor: THEME.divider }} />
                <MenuLink
                    icon={<ArticleOutlinedIcon />}
                    label="작성한 게시물"
                    color={THEME.textSub}
                    onClick={() => onNavigate("/mypage/board")}
                />
                <Divider sx={{ borderColor: THEME.divider }} />
                <MenuLink
                    icon={<RouteOutlinedIcon />}
                    label="나만의 코스 관리"
                    color={THEME.secondary}
                    onClick={() => onNavigate("/mypage/course")}
                />
                <Divider sx={{ borderColor: THEME.divider }} />
                <MenuLink
                    icon={<CalendarTodayOutlinedIcon />}
                    label="출석 달력"
                    color={THEME.error}
                    onClick={() => onSetActiveView("calendar")}
                />
            </List>

            <Typography sx={subheaderSx}>계정 및 설정</Typography>
            <Box
                sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                    bgcolor: "white",
                    mb: 4,
                    border: "1px solid",
                    borderColor: "divider",
                }}>
                <ListItemButton sx={itemSx} onClick={onToggleOpen}>
                    <Box className="icon-box" sx={iconBoxSx("#64748B")}>
                        <ManageAccountsOutlinedIcon />
                    </Box>
                    <ListItemText
                        primary="개인정보 수정"
                        primaryTypographyProps={{
                            fontWeight: 700,
                            color: THEME.textMain,
                        }}
                    />
                    {open ? (
                        <ExpandLess sx={{ color: THEME.textSub }} />
                    ) : (
                        <ExpandMore sx={{ color: THEME.textSub }} />
                    )}
                </ListItemButton>

                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit
                    sx={{ bgcolor: "#F8FAFC" }}>
                    <SubMenuLink
                        icon={<BadgeOutlinedIcon />}
                        label="닉네임 변경"
                        onClick={() => onSetActiveView("username")}
                    />
                    <SubMenuLink
                        icon={<HomeOutlinedIcon />}
                        label="주소 변경"
                        onClick={() => onSetActiveView("address")}
                    />
                    <SubMenuLink
                        icon={<HeightOutlinedIcon />}
                        label="키/몸무게 변경"
                        onClick={() => onSetActiveView("bodyInfo")}
                    />
                    <SubMenuLink
                        icon={<PersonOffOutlinedIcon />}
                        label="회원 탈퇴"
                        onClick={() => onSetActiveView("withdraw")}
                    />
                </Collapse>

                <Divider sx={{ borderColor: THEME.divider }} />

                <ListItemButton sx={itemSx} onClick={onLogout}>
                    <Box className="icon-box" sx={iconBoxSx(THEME.error)}>
                        <LogoutOutlinedIcon />
                    </Box>
                    <ListItemText
                        primary="로그아웃"
                        primaryTypographyProps={{
                            fontWeight: 800,
                            color: THEME.error,
                        }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    function MenuLink({ icon, label, color, onClick, badge }) {
        return (
            <ListItemButton sx={itemSx} onClick={onClick}>
                <Box className="icon-box" sx={iconBoxSx(color)}>
                    {icon}
                </Box>
                <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                        fontWeight: 700,
                        color: THEME.textMain,
                        fontSize: "0.95rem",
                    }}
                />
                {badge && (
                    <Box
                        sx={{
                            bgcolor: THEME.error,
                            color: "white",
                            borderRadius: "10px",
                            px: 1,
                            py: 0.2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: 800,
                            mr: 1,
                        }}>
                        {badge}
                    </Box>
                )}
                <ChevronRightRoundedIcon
                    sx={{ color: "#CBD5E1", fontSize: 20 }}
                />
            </ListItemButton>
        );
    }

    function SubMenuLink({ icon, label, onClick }) {
        return (
            <ListItemButton
                sx={{ px: 4, py: 1.5, "&:hover": { bgcolor: "#F1F5F9" } }}
                onClick={onClick}>
                <ListItemIcon sx={{ minWidth: 40, color: "#94A3B8" }}>
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                        fontSize: "0.9rem",
                        color: "#64748B",
                        fontWeight: 600,
                    }}
                />
                <ChevronRightRoundedIcon
                    sx={{ color: "#E2E8F0", fontSize: 18 }}
                />
            </ListItemButton>
        );
    }
}
