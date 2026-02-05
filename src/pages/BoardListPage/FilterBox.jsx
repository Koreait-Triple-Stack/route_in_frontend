import {
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Box } from "@mui/system";
import { EXERCISE_PARTS } from "../../constants/exerciseParts";
import {
    filterActionBtnBaseSx,
    filterTextFieldSx,
} from "../../constants/design";
function FilterBox({ form, setForm, setTags }) {
    const resetOnClickHandler = () => {
        setTags([]);
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
    };
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
                mt: 1.2,
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                gap: 1.6,
            }}
        >
            {form.type !== "ALL" &&
                (form.type === "COURSE" ? (
                    <>
                        <TextField
                            label="지역"
                            variant="outlined"
                            size="small"
                            value={form.region}
                            name="region"
                            onChange={inputChangeHandler}
                            fullWidth
                            sx={filterTextFieldSx}
                        />
                        <TextField
                            label="최대 거리(km)"
                            type="number"
                            variant="outlined"
                            size="small"
                            value={form.distance}
                            name="distance"
                            inputProps={{ min: 0, step: 1 }}
                            onChange={inputChangeHandler}
                            fullWidth
                            sx={filterTextFieldSx}
                        />
                    </>
                ) : (
                    <>
                        <ToggleButtonGroup
                            value={form.parts}
                            exclusive={false}
                            onChange={() => {}}
                            sx={{
                                display: "block",
                                p: 0,
                                m: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                }}
                            >
                                {EXERCISE_PARTS.map((part) => (
                                    <ToggleButton
                                        key={part}
                                        size="small"
                                        name="parts"
                                        value={part}
                                        selected={form.parts.includes(part)}
                                        onClick={inputChangeHandler}
                                        sx={{
                                            borderRadius: 999,
                                            px: 1.6,
                                            py: 0.7,
                                            fontWeight: 700,
                                            textTransform: "none",
                                            whiteSpace: "nowrap",
                                            bgcolor: "background.paper",
                                            borderColor: "divider",
                                            color: "text.primary",
                                            "&:hover": {
                                                bgcolor: "action.hover",
                                            },
                                            "&.Mui-selected": {
                                                bgcolor: "primary.main",
                                                borderColor: "primary.main",
                                                color: "#fff",
                                                "&:hover": {
                                                    bgcolor: "primary.dark",
                                                },
                                            },
                                        }}
                                    >
                                        {part}
                                    </ToggleButton>
                                ))}
                            </Box>
                        </ToggleButtonGroup>
                    </>
                ))}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 0.2,
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                <Button
                    disableElevation
                    variant="contained"
                    onClick={applyOnClickHandler}
                    sx={{
                        ...filterActionBtnBaseSx,
                        boxShadow: "0 6px 18px rgba(15,23,42,0.10)",
                    }}
                >
                    적용
                </Button>

                <Button
                    variant="outlined"
                    onClick={resetOnClickHandler}
                    sx={{
                        ...filterActionBtnBaseSx,
                        bgcolor: "background.paper",
                    }}
                >
                    필터 초기화
                </Button>
            </Box>
        </Box>
    );
}

export default FilterBox;
