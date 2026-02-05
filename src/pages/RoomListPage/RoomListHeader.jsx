import {
    Collapse,
    IconButton,
    TextField,
    Typography,
    InputAdornment,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function RoomListHeader({
    setSearchInputValue,
    searchInputValue,
}) {
    const [isSearch, setIsSearch] = useState(false);

    const toggleSearch = () => {
        setIsSearch((prev) => !prev);
        setSearchInputValue("");
    };

    return (
        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                px: 1.5,
                pt: 2,
                pb: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                backdropFilter: "blur(8px)",
                transition: "top .22s ease",
            }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between">
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
                    채팅
                </Typography>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton
                        onClick={toggleSearch}>
                        {isSearch ? (
                            <CloseRoundedIcon />
                        ) : (
                            <SearchRoundedIcon />
                        )}
                    </IconButton>
                </Stack>
            </Stack>

            <Collapse in={isSearch}>
                <Box sx={{ mt: 1.2 }}>
                    <TextField
                        value={searchInputValue}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        placeholder="채팅방, 참여자 검색"
                        fullWidth
                        size="small"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 999,
                                bgcolor: "action.hover",
                            },
                        }}
                    />
                </Box>
            </Collapse>
        </Box>
    );
}

export default RoomListHeader;
