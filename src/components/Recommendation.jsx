import { CardContent, Chip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";

function Recommendation({ title, reason, tags }) {
    return (
        <CardContent>
            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="primary.main">
                {title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                {reason}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {tags?.map((tag, index) => (
                    <Chip key={index} label={tag} color="primary" variant="outlined" size="small" sx={{ fontWeight: "medium" }} />
                ))}
            </Stack>
        </CardContent>
    );
}

export default Recommendation;
