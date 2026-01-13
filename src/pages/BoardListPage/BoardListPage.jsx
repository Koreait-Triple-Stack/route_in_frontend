import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box, Container, Grid } from "@mui/system";
import React, { useState } from "react";
import { Paper, TextField } from "@mui/material";
import TypeBox from "./TypeBox";

function BoardListPage() {
    const [type, setType] = useState("전체");
    const [checked, setChecked] = useState(false);

    return (
        <Container maxWidth="sm" sx={{ padding: "20px" }}>
            <TypeBox type={type} setType={setType} checked={checked} setChecked={setChecked} />
            {checked && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                        border: "1px solid #dbdbdb",
                        padding: "20px",
                        boxSizing: "border-box",
                        borderRadius: "12px",
                    }}>
                    {type !== "전체" &&
                        (type === "러닝코스" ? (
                            <>
                                <TextField
                                    id="region"
                                    label="지역"
                                    variant="standard"
                                />
                                <TextField
                                    label="최대 거리(km)"
                                    type="number"
                                    variant="standard"
                                    inputProps={{
                                        min: 0,
                                        step: 1,
                                    }}
                                />
                            </>
                        ) : (
                            <>운동루틴</>
                        ))}
                    <Button variant="outlined">필터 초기화</Button>
                </Box>
            )}
            <Box></Box>
        </Container>
    );
}

export default BoardListPage;
