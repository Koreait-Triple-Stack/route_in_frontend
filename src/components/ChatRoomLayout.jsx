import { Box } from "@mui/system";

export default function ChatRoomLayout({ children }) {
    return (
        <Box
            sx={{
                height: "100svh",
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                overscrollBehavior: "none",
                touchAction: "manipulation",
                width: "100%",
            }}>
            {children}
        </Box>
    );
}
