import React from 'react';
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OverlayWrapper = ({ title, onClose, children }) => {
    return (
        <Box 
            sx={{
                position: "absolute", 
                top: 0, left: 0, 
                width: "100%", height: "100%", 
                bgcolor: "background.paper", 
                zIndex: 10, padding: 2, 
                boxSizing: 'border-box',
                display: "flex", flexDirection: "column"
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
                <IconButton onClick={onClose} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">{title}</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {children}
            </Box>
        </Box>
    );
};

export default OverlayWrapper;