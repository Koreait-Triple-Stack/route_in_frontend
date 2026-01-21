import { Box } from "@mui/system";
import {  MoonLoader } from "react-spinners";

function Loading() {
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <MoonLoader />
        </Box>
    );
}

export default Loading;
