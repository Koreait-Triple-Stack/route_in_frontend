import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box, Grid } from "@mui/system";
import React from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

function TypeBox({ type, setType, checked, setChecked }) {
    const handleChange = (e, newValue) => {
        if (newValue !== null) {
            setType(newValue);
        }
    };

    return (
        <Box
            sx={{
                width: 557,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
            }}>
            <ToggleButtonGroup value={type} exclusive onChange={handleChange}>
                <Grid container spacing={1}>
                    <ToggleButton value="전체">전체</ToggleButton>
                    <ToggleButton value="러닝코스">러닝코스</ToggleButton>
                    <ToggleButton value="운동루틴">운동루틴</ToggleButton>
                </Grid>
            </ToggleButtonGroup>

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
