import { Box, Typography } from "@mui/material";

export default function ProfileHeader({ user }) {
    const base = user?.address?.baseAddress ?? "";
    const [city, district] = base.split(" ");

    return (
        <Box
            sx={{
                px: 2,
                py: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
            }}>
            <Box
                component="img"
                src={user?.profileImageUrl}
                alt="profile"
                sx={{
                    width: 72,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0,
                    bgcolor: "grey.100",
                }}
            />

            <Box
                sx={{
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.3,
                }}>
                <Typography
                    sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
                    {user?.username}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                    {user?.gender} • {city} {district}
                </Typography>

                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {user?.height}cm / {user?.weight}kg
                </Typography>
            </Box>
        </Box>
    );
}
