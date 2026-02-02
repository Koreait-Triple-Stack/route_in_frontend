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
                pl: 0.8,
            }}>
            <ToggleButtonGroup
                value={form.type}
                size="small"
                exclusive
                onChange={inputChangeHandler}
                sx={{}}>
                <Stack direction={"row"} spacing={0.6}>
                    <ToggleButton
                        name="type"
                        value="ALL"
                        sx={{
                            color: "primary.main",
                            borderColor: "primary.main",
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "#fff",
                                "&:hover": {
                                    color: "#fff",
                                    bgcolor: "primary.main",
                                },
                            },
                            "&:hover": {
                                color: "#fff",
                                bgcolor: "primary.main",
                            },
                        }}>
                        전체
                    </ToggleButton>
                    <ToggleButton
                        name="type"
                        value="COURSE"
                        sx={{
                            color: "primary.main",
                            borderColor: "primary.main",
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "#fff",
                                "&:hover": {
                                    color: "#fff",
                                    bgcolor: "primary.main",
                                },
                            },
                            "&:hover": {
                                color: "#fff",
                                bgcolor: "primary.main",
                            },
                        }}>
                        러닝코스
                    </ToggleButton>
                    <ToggleButton
                        name="type"
                        value="ROUTINE"
                        sx={{
                            color: "primary.main",
                            borderColor: "primary.main",
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "#fff",
                                "&:hover": {
                                    color: "#fff",
                                    bgcolor: "primary.main",
                                },
                            },
                            "&:hover": {
                                color: "#fff",
                                bgcolor: "primary.main",
                            },
                        }}>
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
                        sx={{
                            fontSize: 14,
                            color: "primary.main",

                            // ✅ 기본 테두리
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "primary.main",
                            },

                            // ✅ hover
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "primary.main",
                            },

                            // ✅ focus
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "primary.main",
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
                    onChange={() => setChecked((prev) => !prev)}
                    sx={{
                        color: "primary.main",
                        borderColor: "primary.main",
                        "&.Mui-selected": {
                            bgcolor: "primary.main",
                            color: "#fff",
                            "&:hover": {
                                bgcolor: "primary.dark",
                                color: "#fff",
                            },
                        },
                        "&:hover": {
                            bgcolor: "primary.dark",
                            color: "#fff",
                        },
                    }}>
                    <FilterAltOutlinedIcon />
                </ToggleButton>
            </Box>
        </Box>
    );
}

export default TypeBox;
