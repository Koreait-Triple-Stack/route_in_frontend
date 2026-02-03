import { Box, Container } from "@mui/system";
import BasicBottomNav, { NAV_H } from "./BasicBottomNav";
import { useLocation } from "react-router-dom";
import LayoutHeader, { HEADER_H } from "./LayoutHeader";


export default function AppLayout({ children }) {
    const location = useLocation();
    const isChatRoom = location.pathname.includes("/chat/room");

    return (
        <Box
            sx={{
                height: "100svh",
                // ✅ 앱 배경도 깔끔하게 (밝은 톤)
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            }}>
            {!isChatRoom && <LayoutHeader />}

            <Container maxWidth="sm" disableGutters sx={{ height: "100%" }}>
                <Box
                    id="app-scroll"
                    sx={{
                        height: "100%",
                        overflowY: "auto",
                        pb: `${NAV_H}px`,
                        // 헤더가 fixed 라면 pt로 밀어줘야 함 (LayoutHeader 구현에 따라)
                        pt: !isChatRoom ? `${HEADER_H}px` : 0,

                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}>
                    {children}
                </Box>
            </Container>

            {/* ✅ 앱에서만 바텀 네비 */}
            {<BasicBottomNav />}
        </Box>
    );
}
