import React from "react";
/** @jsxImportSource @emotion/react */
import { Box } from "@mui/system";
import BasicBottomNav from "../BasicBottomNav/BasicBottomNav";

function Layout({ children }) {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Box sx={{ flex: 1, overflowY: "auto" }}>{children}</Box>
            
            <BasicBottomNav />
        </Box>
    );
}

export default Layout;
