import React, { useEffect } from "react";
/** @jsxImportSource @emotion/react */
import { Box, Container } from "@mui/system";
import BasicBottomNav from "./BasicBottomNav";
import { usePrincipalState } from "../store/usePrincipalState";

const NAV_H = 56;

function Layout({ children }) {

    return (
        <Box sx={{ height: "100svh" }}>
            <Container
                maxWidth="sm"
                disableGutters
                sx={{ height: "100%", px: { xs: 2, sm: 2 }, py: 1 }}>
                <Box
                    sx={{
                        height: "100%",
                        overflowY: "auto",
                        pb: `${NAV_H}px`,
                    }}>
                    {children}
                </Box>
            </Container>
            <BasicBottomNav />
        </Box>
    );
}

export default Layout;
