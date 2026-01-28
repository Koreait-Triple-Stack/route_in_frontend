import React from "react";
import { useToastStore } from "../store/useToastStore";
import { Alert, Snackbar } from "@mui/material";

function ToastProvider() {
    const { open, message, severity, close } = useToastStore();

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        close();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3500}
            onClose={handleClose}
            sx={{ pointerEvents: "none" }}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}>
            <Alert
                severity={severity}
                variant="filled"
                onClose={handleClose}
                sx={{ pointerEvents: "auto", maxWidth: 320 }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default ToastProvider;
