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
                height: "100dvh",
                minHeight: "100svh",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                overflow: "hidden",
            }}>
            {!isChatRoom && <LayoutHeader />}

            <Container maxWidth="sm" disableGutters sx={{ height: "100%" }}>
                <Box
                    id="app-scroll"
                    sx={{
                        "--header-offset": `${HEADER_H}px`,
                        height: "100%",
                        minHeight: 0,
                        overflowY: isChatRoom ? "hidden" : "auto",
                        pb: !isChatRoom ? `${NAV_H + 20}px` : 0,
                        pt: !isChatRoom ? "var(--header-offset)" : 0,
                        transition: "padding-top 0s",
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}>
                    {children}
                </Box>
            </Container>

            {!isChatRoom && <BasicBottomNav />}
        </Box>
    );
}
