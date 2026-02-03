import { Box, Container } from "@mui/system";
import BasicBottomNav from "./BasicBottomNav";
import { useLocation } from "react-router-dom";
import LayoutHeader from "./LayoutHeader";

const NAV_H = 56;

function Layout({ children }) {
    const location = useLocation();

    const isChatRoom = location.pathname.includes("/chat/room");
    return (
        <Box sx={{ height: "100svh" }}>
            {isChatRoom ? <></> : <LayoutHeader />}
            <Container
                maxWidth="sm"
                disableGutters
                sx={{ height: "100%"}}>
                <Box
                    id="app-scroll"
                    sx={{
                        height: "100%",
                        overflowY: "auto",
                        pb: `${NAV_H}px`,
                        msOverflowStyle: "none", // IE/Edge
                        scrollbarWidth: "none", // Firefox
                        "&::-webkit-scrollbar": {
                            display: "none", // Chrome/Safari
                        },
                    }}>
                    {children}
                </Box>
            </Container>
            <BasicBottomNav />
        </Box>
    );
}

export default Layout;
