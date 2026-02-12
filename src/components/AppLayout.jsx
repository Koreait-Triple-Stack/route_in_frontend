import { Box, Container } from "@mui/system";
import BasicBottomNav, { NAV_H } from "./BasicBottomNav";
import LayoutHeader, { HEADER_H } from "./LayoutHeader";

export default function AppLayout({ children }) {

    return (
        <Box
            sx={{
                height: "100dvh",
                minHeight: "100svh",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                overflow: "hidden",
            }}>
            <LayoutHeader />

            <Container maxWidth="sm" disableGutters sx={{ height: "100%" }}>
                <Box
                    id="app-scroll"
                    sx={{
                        "--header-offset": `${HEADER_H}px`,
                        height: "100%",
                        minHeight: 0,

                        overflowY: "auto",
                        overflowX: "hidden",

                        pb: `${NAV_H + 20}px`,
                        pt: "var(--header-offset)",

                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}>
                    {children}
                </Box>
            </Container>

            <BasicBottomNav />
        </Box>
    );
}
