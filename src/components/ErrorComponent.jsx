import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

function ErrorComponent({ error }) {
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    width: "100%",
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textAlign: "center",
                }}>
                <Typography color="error" sx={{ fontWeight: 800 }}>
                    에러가 발생했어요
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5 }}>
                    {error?.message} 
                </Typography>
            </Paper>
        </Box>
    );
}

export default ErrorComponent;
