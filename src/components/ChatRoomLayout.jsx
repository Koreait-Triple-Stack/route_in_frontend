import { Box } from "@mui/system";
import useVisualViewportVars from "../pages/ChatRoomPage/useVisualViewportVars";

export default function ChatRoomLayout({ children }) {
    // useVisualViewportVars();

    return (
        <Box
            sx={{
                // position: "fixed",
                // inset: 0,
                // height: "var(--vvh, 100dvh)",
                height: "100%",
                overflow: "hidden",
                backgroundColor: "#f2f2f2",
                // overscrollBehavior: "none",
                // touchAction: "none",
            }}>
            {children}
        </Box>
    );
}
