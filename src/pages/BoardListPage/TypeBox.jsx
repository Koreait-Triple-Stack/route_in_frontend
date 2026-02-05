import {
    FormControl,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { boardSortSelectSx, boardTypeBtnSx } from "../../constants/design";
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
            }}
        >
            <ToggleButtonGroup
                value={form.type}
                size="small"
                exclusive
                onChange={inputChangeHandler}
            >
                <Stack direction={"row"} spacing={0.6}>
                    <ToggleButton name="type" value="ALL" sx={boardTypeBtnSx}>
                        전체
                    </ToggleButton>
                    <ToggleButton
                        name="type"
                        value="COURSE"
                        sx={boardTypeBtnSx}
                    >
                        러닝코스
                    </ToggleButton>
                    <ToggleButton
                        name="type"
                        value="ROUTINE"
                        sx={boardTypeBtnSx}
                    >
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
                }}
            >
                <FormControl size="small">
                    <Select
                        name="sort"
                        value={form.sort}
                        onChange={inputChangeHandler}
                        displayEmpty
                        sx={boardSortSelectSx}
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
                                        minHeight: 40,
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
                        }}
                    >
                        <MenuItem value="LATEST">최신순</MenuItem>
                        <MenuItem value="RECOMMEND">추천순</MenuItem>
                    </Select>
                </FormControl>

                <ToggleButton
                    size="small"
                    value="checked"
                    selected={checked}
                    onChange={() => setChecked((prev) => !prev)}
                    sx={boardTypeBtnSx}
                >
                    <FilterAltOutlinedIcon />
                </ToggleButton>
            </Box>
        </Box>
    );
}

export default TypeBox;
