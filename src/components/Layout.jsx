import React from "react";
/** @jsxImportSource @emotion/react */
import { Box, Container } from "@mui/system";
import BasicBottomNav from "./BasicBottomNav";


function Layout({ children }) {
    return (
        <Container
            sx={{
                maxWidth: "sm",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pt: 3,
                pb: 8
            }}>
            <Box sx={{ flex: 1, overflowY: "auto" }}>{children}</Box>

            <BasicBottomNav />
        </Container>
    );
}

export default Layout;
