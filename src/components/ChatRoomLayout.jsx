import { Box } from "@mui/system";
import { useLockBodyScroll } from "../pages/ChatRoomPage/useLockBodyScroll";

export default function ChatRoomLayout({ children }) {
    useLockBodyScroll(true);

    return (
        <Box
            sx={{
                height: "100dvh",
                minHeight: "100svh",
                overflow: "hidden",
                backgroundColor: "#f2f2f2",
                overscrollBehavior: "none",
            }}>
            {children}
        </Box>
    );
}
