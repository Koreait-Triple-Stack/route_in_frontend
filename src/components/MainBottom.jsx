import { Box } from "@mui/system";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

function MainBottom() {
    return (
        <Box
            sx={{
                display: "flex",
                position: "absolute",
                bottom: "0",
                borderTop: "1px solid #dbdbdb",
                width: "100%",
                height: "75px",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 110
            }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "500px"
                }}>
                <HomeOutlinedIcon />
                <AccountCircleOutlinedIcon />
            </Box>
        </Box>
    );
}

export default MainBottom;
