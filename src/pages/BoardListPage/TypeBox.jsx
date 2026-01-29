import {
    FormControl,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Box, Grid, Stack } from "@mui/system";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

function TypeBox({ checked, setChecked, form, setForm, setTags }) {
    const inputChangeHandler = (e) => {
        setTags([]);
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            region: "",
            distance: 0,
            parts: [],
        }));
    };
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
                size="small"
                exclusive
                onChange={inputChangeHandler}>
                <Stack direction={"row"} spacing={0.6}>
                    <ToggleButton name="type" value="ALL">
                        전체
                    </ToggleButton>
                    <ToggleButton name="type" value="COURSE">
                        러닝코스
                    </ToggleButton>
                    <ToggleButton name="type" value="ROUTINE">
                        운동루틴
                    </ToggleButton>
                </Stack>
            </ToggleButtonGroup>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                }}>
                <FormControl size="small">
                    <Select
                        name="sort"
                        value={form.sort}
                        onChange={inputChangeHandler}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        sx={{
                            fontSize: 15, // ✅ 선택된 값 글씨 크기

                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#bdbdbd",
                            },

                            "& .MuiSelect-icon": { fontSize: 18 },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    "& .MuiMenuItem-root": {
                                        fontSize: 13,
                                        minHeight: 36,
                                    },
                                },
                            },
                        }}>
                        <MenuItem value="LATEST">최신순</MenuItem>
                        <MenuItem value="RECOMMEND">추천순</MenuItem>
                    </Select>
                </FormControl>

                <ToggleButton
                    size="small"
                    value="checked"
                    selected={checked}
                    onChange={() => setChecked((prev) => !prev)}>
                    <FilterAltOutlinedIcon />
                </ToggleButton>
            </Box>
        </Box>
    );
}

export default TypeBox;
