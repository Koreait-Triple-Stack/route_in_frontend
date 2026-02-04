import {
    Box,
    Typography,
    Card,
    CardContent,
} from "@mui/material";

function FeatureMini({ icon, title, desc }) {
    return (
        <Card
            sx={{
                flex: 1,
                borderRadius: "18px",
                backgroundColor: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(15,23,42,0.10)",
                boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
            }}>
            <CardContent sx={{ p: 2 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        background:
                            "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(34,197,94,0.14))",
                        border: "1px solid rgba(15,23,42,0.10)",
                        mb: 1,
                    }}>
                    {icon}
                </Box>
                <Typography sx={{ fontWeight: 1000 }}>{title}</Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "rgba(15,23,42,0.68)", lineHeight: 1.6 }}>
                    {desc}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default FeatureMini;
