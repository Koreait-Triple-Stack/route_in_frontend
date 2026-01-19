import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box, Grid } from "@mui/system";
import React from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

function TypeBox({checked, setChecked }) {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
            }}>
    
            <ToggleButton
                value="checked"
                selected={checked}
                onChange={() => setChecked((prev) => !prev)}>
                <FilterAltOutlinedIcon />
            </ToggleButton>
        </Box>
    );
}

export default TypeBox;
