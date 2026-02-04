import {
    FormControl,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import {
    boardSortSelectSx,
    boardTypeBtnSx,
    selectMenuPaperSx,
} from "../../constants/design";
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
            }}
        >
            <ToggleButtonGroup
                value={form.type}
                size="small"
                exclusive
                onChange={inputChangeHandler}
                sx={{}}
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
                        MenuProps={{ PaperProps: { sx: selectMenuPaperSx } }}
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
