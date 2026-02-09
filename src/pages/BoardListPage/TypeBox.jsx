import {
    FormControl,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { softPillSx, subtleRingSx } from "../../constants/boardDesign";

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
                gap: 1,
                flexWrap: "wrap",
                px: 1,
                py: 1,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(255,255,255,0.60)",
                backdropFilter: "blur(10px)",
            }}>
            <ToggleButtonGroup
                value={form.type}
                size="small"
                exclusive
                onChange={inputChangeHandler}
                sx={{ flexWrap: "wrap" }}>
                <Stack direction={"row"} spacing={0.6}>
                    <ToggleButton
                        name="type"
                        value="ALL"
                        sx={{
                            ...softPillSx,
                            ...subtleRingSx,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "#fff",
                                borderColor: "primary.main",
                                boxShadow: "0 10px 20px rgba(99,102,241,0.25)",
                            },
                            "&.Mui-selected:hover": {
                                bgcolor: "primary.main",
                                borderColor: "primary.main",
                                boxShadow: "0 10px 20px rgba(99,102,241,0.22)",
                            },
                        }}>
                        전체
                    </ToggleButton>
                    <ToggleButton
                        name="type"
                        value="COURSE"
                        sx={{
                            ...softPillSx,
                            ...subtleRingSx,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "#fff",
                                borderColor: "primary.main",
                                boxShadow: "0 10px 20px rgba(99,102,241,0.25)",
                            },
                            "&.Mui-selected:hover": {
                                bgcolor: "primary.main",
                                borderColor: "primary.main",
                                boxShadow: "0 10px 20px rgba(99,102,241,0.22)",
                            },
                        }}>
                        러닝코스
                    </ToggleButton>
                    <ToggleButton
                        name="type"
                        value="ROUTINE"
                        sx={{
                            ...softPillSx,
                            ...subtleRingSx,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "#fff",
                                borderColor: "primary.main",
                                boxShadow: "0 10px 20px rgba(99,102,241,0.25)",
                            },
                            "&.Mui-selected:hover": {
                                bgcolor: "primary.main",
                                borderColor: "primary.main",
                                boxShadow: "0 10px 20px rgba(99,102,241,0.22)",
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
                    flexWrap: "wrap",
                    flexShrink: 0,
                }}>
                <FormControl size="small">
                    <Select
                        name="sort"
                        value={form.sort}
                        onChange={inputChangeHandler}
                        displayEmpty
                        sx={{
                            height: 36,
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 900,
                            bgcolor: "background.paper",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "divider",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(99,102,241,0.45)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "primary.main",
                            },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    mt: 1,
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    boxShadow:
                                        "0 10px 24px rgba(15,23,42,0.12)",
                                    overflow: "hidden",
                                    "& .MuiList-root": { py: 0.5 },
                                    "& .MuiMenuItem-root": {
                                        fontSize: 13,
                                        px: 1,
                                        mx: 0.6,
                                        my: 0.3,
                                        borderRadius: 1,
                                        "&:hover": { bgcolor: "action.hover" },
                                        "&.Mui-selected": {
                                            bgcolor: "primary.main",
                                            color: "#fff",
                                            fontWeight: 800,
                                            "&:hover": {
                                                bgcolor: "primary.dark",
                                            },
                                        },
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
                        ...softPillSx,
                        height: 36,
                        minWidth: 40,
                        px: 1.2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        "&.Mui-selected": {
                            bgcolor: "rgba(99,102,241,0.12)",
                            borderColor: "rgba(99,102,241,0.45)",
                            color: "primary.main",
                        },
                    }}>
                    <FilterAltOutlinedIcon sx={{ fontSize: 20 }} />
                </ToggleButton>
            </Box>
        </Box>
    );
}

export default TypeBox;
