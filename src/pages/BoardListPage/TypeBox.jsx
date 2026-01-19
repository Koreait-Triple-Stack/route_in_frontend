import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box, Grid } from "@mui/system";
import React from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

function TypeBox({ checked, setChecked, form, setForm, setTags }) {
    const inputChangeHandler = (e) => {
        setTags([]);
        setForm({
            type: e.target.value,
            region: "",
            distance: 0,
            parts: [],
        });
    }
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
            }}>
            <ToggleButtonGroup
                value={form.type}
                exclusive
                onChange={inputChangeHandler}>
                <Grid container spacing={1}>
                    <ToggleButton name="type" value="ALL">
                        전체
                    </ToggleButton>
                    <ToggleButton name="type" value="COURSE">
                        러닝코스
                    </ToggleButton>
                    <ToggleButton name="type" value="ROUTINE">
                        운동루틴
                    </ToggleButton>
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
