import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Badge,
    Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { usePrincipalState } from "../store/usePrincipalState";
import { countUnreadChatByUserIdRequest } from "../apis/chat/chatApi";
import { FiHome, FiMessageCircle, FiUser, FiEdit3 } from "react-icons/fi";
import { motion } from "framer-motion";
import { RiWechat2Line } from "react-icons/ri";

export const NAV_H = 64;

function normalizeValue(pathname) {
    if (pathname.startsWith("/board")) return "/board";
    if (pathname.startsWith("/chat")) return "/chat";
    if (pathname.startsWith("/mypage")) return "/mypage";
    if (pathname.startsWith("/main")) return "/main";
    return "/";
}

export default function BasicBottomNav() {
    const location = useLocation();
    const { principal } = usePrincipalState();

    const { data: chatResp } = useQuery({
        queryFn: () => countUnreadChatByUserIdRequest(principal.userId),
        queryKey: ["countUnreadChatByUserIdRequest", principal?.userId],
    });

    const value = normalizeValue(location.pathname);

    return (
        <Paper
            elevation={0}
            sx={{
                position: "fixed",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "calc(100% - 24px)",
                maxWidth: 500,
                height: NAV_H,
                borderRadius: 24,
                border: "1px solid rgba(15,23,42,0.08)",
                backgroundColor: "rgba(255,255,255,0.9)",
                boxShadow: "0 12px 40px rgba(15,23,42,0.15)",
                backdropFilter: "blur(12px)",
                overflow: "hidden",
                zIndex: (theme) => theme.zIndex.modal - 1,
            }}>
            <BottomNavigation
                value={value}
                showLabels={false}
                sx={{ height: "100%", bgcolor: "transparent" }}>
                <NavItem
                    value="/main"
                    selected={value === "/main"}
                    icon={<FiHome />}
                />
                <NavItem
                    value="/board"
                    selected={value === "/board"}
                    icon={<FiEdit3 />}
                />
                <NavItem
                    value="/chat"
                    selected={value === "/chat"}
                    icon={
                        <Badge badgeContent={chatResp?.data} color="error">
                            <RiWechat2Line />
                        </Badge>
                    }
                />
                <NavItem
                    value="/mypage"
                    selected={value === "/mypage"}
                    icon={<FiUser />}
                />
            </BottomNavigation>
        </Paper>
    );
}

function NavItem({ value, selected, icon }) {
    const naviagte = useNavigate();

    return (
        <BottomNavigationAction
            value={value}
            onClick={() => naviagte(value)}
            icon={
                <Box
                    sx={{
                        position: "relative",
                        width: 46,
                        height: 46,
                        borderRadius: 18,
                        display: "grid",
                        placeItems: "center",
                    }}
                    component={motion.div}
                    whileTap={{ scale: 0.92 }}
                    transition={{
                        type: "spring",
                        stiffness: 700,
                        damping: 26,
                    }}>
                    {selected && (
                        <Box
                            component={motion.div}
                            layoutId="nav-indicator"
                            transition={{
                                type: "spring",
                                stiffness: 520,
                                damping: 38,
                                mass: 0.8,
                            }}
                            sx={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: 18,
                                background: "rgba(37,99,235,0.12)",
                            }}
                        />
                    )}

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            color: selected ? "#2563eb" : "rgba(15,23,42,0.45)",
                            "& svg": { fontSize: 22 },
                        }}>
                        {icon}
                    </Box>
                </Box>
            }
            sx={{
                minWidth: 0,
                transition: "color .18s ease",
            }}
        />
    );
}
