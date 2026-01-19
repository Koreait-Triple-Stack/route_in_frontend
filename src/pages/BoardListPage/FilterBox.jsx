import {
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Box, Grid } from "@mui/system";
import { EXERCISE_TAGS } from "../../constants/exerciseTags";

function FilterBox({ form, setForm }) {
    const resetOnClickHandler = () => {
        setForm({
            type: "ALL",
            region: "",
            distance: 0,
            tags: [],
        });
    };

    const inputChangeHandler = (e) => {
        const { name, value } = e.target;

        if (name === "tags") {
            setForm((prev) => {
                if (prev.tags.includes(value)) {
                    return {
                        ...prev,
                        [name]: prev.tags.filter((tag) => tag !== value),
                    };
                } else {
                    return {
                        ...prev,
                        [name]: [...prev.tags, value],
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
                        value={form.tags}
                        exclusive
                        onChange={inputChangeHandler}>
                        <Grid container spacing={1}>
                            {EXERCISE_TAGS.map((tag) => (
                                <ToggleButton
                                    key={tag}
                                    name="tags"
                                    value={tag}
                                    selected={form.tags.includes(tag)}
                                    sx={{
                                        borderRadius: 999,
                                        px: 2,
                                        boxSizing: "border-box",
                                    }}>
                                    {tag}
                                </ToggleButton>
                            ))}
                        </Grid>
                    </ToggleButtonGroup>
                ))}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={resetOnClickHandler}>
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
