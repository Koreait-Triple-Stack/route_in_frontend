import { Box } from "@mui/system";
import { useLockBodyScroll } from "../pages/ChatRoomPage/useLockBodyScroll";
import useVisualViewportVars from "../pages/ChatRoomPage/useVisualViewportVars";

export default function ChatRoomLayout({ children }) {
    useLockBodyScroll(true);
    useVisualViewportVars();

    return (
        <Box
            sx={{
                height: "var(--vvh, 100dvh)",
                overflow: "hidden",
                backgroundColor: "#f2f2f2",
                overscrollBehavior: "none",
            }}>
            {children}
        </Box>
    );
}
