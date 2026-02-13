import { Box } from "@mui/system";

export default function ChatRoomLayout({ children }) {
    return (
        <Box
            sx={{
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                width: "100%",
            }}>
            {children}
        </Box>
    );
}
