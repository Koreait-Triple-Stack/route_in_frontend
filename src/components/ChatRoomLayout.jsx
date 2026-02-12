import { Box } from "@mui/system";

export default function ChatRoomLayout({ children }) {

    return (
        <Box
            sx={{
                height: "100dvh",
                minHeight: "100dvh",
                overflow: "hidden",
                overscrollBehavior: "none",
                touchAction: "manipulation",
            }}>
            {children}
        </Box>
    );
}
