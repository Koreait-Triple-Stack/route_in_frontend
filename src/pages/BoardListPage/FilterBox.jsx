import {
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Box, Grid } from "@mui/system";
import { EXERCISE_PARTS } from "../../constants/exerciseParts";

function FilterBox({ form, setForm, setTags }) {
    const resetOnClickHandler = () => {
        setTags([])
        setForm({
            type: "ALL",
            sort: "LATEST",
            region: "",
            distance: 0,
            parts: [],
        });
    };

    const applyOnClickHandler = () => {
        if (form.type === "ALL") {
            setTags([]);
        } else if (form.type === "COURSE") {
            setTags([form.region, form.distance]);
        } else if (form.type === "ROUTINE") {
            setTags(form.parts);
        }
    }

    const inputChangeHandler = (e) => {
        const { name, value } = e.target;

        if (name === "parts") {
            setForm((prev) => {
                if (prev.parts.includes(value)) {
                    return {
                        ...prev,
                        [name]: prev.parts.filter((part) => part !== value),
                    };
                } else {
                    return {
                        ...prev,
                        [name]: [...prev.parts, value],
                    };
                }
            });
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                border: "1px solid #dbdbdb",
                padding: "20px",
                boxSizing: "border-box",
                borderRadius: "12px",
                mb: 1,
            }}>
            {form.type !== "ALL" &&
                (form.type === "COURSE" ? (
                    <>
                        <TextField
                            label="지역"
                            variant="standard"
                            value={form.region}
                            name="region"
                            onChange={inputChangeHandler}
                        />
                        <TextField
                            label="최대 거리(km)"
                            type="number"
                            variant="standard"
                            value={form.distance}
                            name="distance"
                            inputProps={{
                                min: 0,
                                step: 1,
                            }}
                            onChange={inputChangeHandler}
                        />
                    </>
                ) : (
                    <ToggleButtonGroup
                        value={form.parts}
                        exclusive
                        onChange={inputChangeHandler}>
                        <Grid container spacing={1}>
                            {EXERCISE_PARTS.map((part) => (
                                <ToggleButton
                                    key={part}
                                    size="small"
                                    name="parts"
                                    value={part}
                                    selected={form.parts.includes(part)}
                                    sx={{
                                        borderRadius: 999,
                                        px: 2,
                                        boxSizing: "border-box",
                                    }}>
                                    {part}
                                </ToggleButton>
                            ))}
                        </Grid>
                    </ToggleButtonGroup>
                ))}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={applyOnClickHandler}>
                    적용
                </Button>
                <Button variant="outlined" onClick={resetOnClickHandler}>
                    필터 초기화
                </Button>
            </Box>
        </Box>
    );
}

export default FilterBox;
