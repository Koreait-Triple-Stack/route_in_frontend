import React from "react";
/** @jsxImportSource @emotion/react */
import { Box, Container } from "@mui/system";
import BasicBottomNav from "./BasicBottomNav";

const NAV_H = 56;

function Layout({ children }) {
    return (
        <Box
            sx={{
                minHeight: "100dvh",
                bgcolor: "background.default",
            }}>
            <Container
                maxWidth="sm"
                disableGutters
                sx={{
                    minHeight: "100dvh",
                    px: { xs: 0, sm: 2 },
                    pt: { xs: 0, sm: 2 },
                    pb: `${NAV_H + 16}px`, // 네비 + 여유
                }}>
                <Box sx={{ width: "100%" }}>{children}</Box>

                <BasicBottomNav />
            </Container>
        </Box>
    );
}

export default Layout;
