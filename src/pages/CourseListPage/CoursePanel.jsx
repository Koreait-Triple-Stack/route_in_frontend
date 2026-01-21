import { Box, Collapse, Divider, Paper } from "@mui/material";

export default function CoursePanel({ open, children }) {
    return (
        <>
            <Divider />
            <Collapse in={open} timeout={200} unmountOnExit>
                <Box sx={{ p: 1.5, maxHeight: "65vh", overflow: "auto" }}>
                    <Paper elevation={0} sx={{ background: "transparent" }}>
                        {children}
                    </Paper>
                </Box>
            </Collapse>
        </>
    );
}
