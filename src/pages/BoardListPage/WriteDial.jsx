import { useMediaQuery } from "@mui/system";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CloseIcon from "@mui/icons-material/Close";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

function WriteDial() {
    const [open, setOpen] = useState(false);
    const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleToggle = () => setOpen((prev) => !prev);

    return (
        <SpeedDial
            ariaLabel="write speed dial"
            open={open}
            direction="up"
            icon={open ? <CloseIcon /> : <CreateOutlinedIcon />}
            onOpen={canHover ? handleOpen : undefined} // ✅ 데스크탑 hover
            onClose={canHover ? handleClose : undefined} // ✅ 데스크탑 hover out
            FabProps={{
                onClick: !canHover ? handleToggle : undefined, // ✅ 모바일 탭으로 토글
            }}
            sx={{
                position: "fixed",
                right: 16,
                bottom: 56 + 16,
                zIndex: 1300,

                "& .MuiFab-root": {
                    width: 64,
                    height: 64,
                    bgcolor: "primary.light",
                    color: "#fff",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                    "&:hover": { bgcolor: "primary.main" },
                },
                "& .MuiSpeedDialAction-fab": {
                    width: 64,
                    height: 64,
                },
            }}>
            <SpeedDialAction
                icon={<FitnessCenterIcon />}
                tooltipTitle="루틴 작성"
                onClick={() => {
                    navigate("/board/write/routine");
                    setOpen(false);
                }}
            />
            <SpeedDialAction
                icon={<DirectionsRunIcon />}
                tooltipTitle="러닝 작성"
                onClick={() => {
                    navigate("/board/write/course");
                    setOpen(false);
                }}
            />
        </SpeedDial>
    );
}

export default WriteDial;
