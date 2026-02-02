import { CardContent, Typography, Stack, Chip, Box } from "@mui/material";

const AIRecommendContent = ({ title, reason, tags }) => {
    const THEME = {
        accent: "#00E5FF", // 네온 블루
        glass: "rgba(255, 255, 255, 0.03)",
        border: "rgba(0, 229, 255, 0.2)",
    };

    return (
        <CardContent sx={{ p: 0, mb: 4 }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: "#1D1D1F", mb: 1.5 }}>
                {title}
            </Typography>

            <Box sx={{ 
                bgcolor: "#F8F9FA", // 아주 연한 회색 배경
                p: 2, 
                borderRadius: "18px", 
                mb: 2,
                border: "1px solid #EDF1F7"
            }}>
                <Typography variant="body2" sx={{ color: "#424245", lineHeight: 1.7 }}>
                    {reason}
                </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {tags?.map((tag, index) => (
                    <Chip 
                        key={index} 
                        label={tag} 
                        sx={{ 
                            bgcolor: "#E3F2FD", 
                            color: "#007AFF", 
                            fontWeight: "700",
                            fontSize: "0.7rem",
                            border: "none"
                        }} 
                    />
                ))}
            </Stack>
        </CardContent>
    );
};

export default AIRecommendContent;
