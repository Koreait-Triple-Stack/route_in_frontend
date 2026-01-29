import {
    AppBar,
    Drawer,
    IconButton,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SearchIcon from "@mui/icons-material/Search";

function RoomListHeader({
    setIsNewChat,
    setSearchInputValue,
    searchInputValue,
}) {
    const [isSetting, setIsSetting] = useState(false);
    const [isSearch, setIsSearch] = useState(false);

    const searchOnClickHandler = () => {
        setIsSearch(!isSearch);
        setSearchInputValue("");
    };

    return (
        <Box sx={{ flexShrink: 0 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    width: "100%",
                }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        채팅
                    </Typography>
                </Box>
                <Box>
                    <IconButton
                        size="large"
                        onClick={searchOnClickHandler}
                        sx={{ color: "#000" }}>
                        <SearchIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        onClick={() => setIsNewChat(true)}
                        sx={{ color: "#000" }}>
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        onClick={() => setIsSetting(!isSetting)}
                        sx={{ color: "#000", pr: 0 }}>
                        <SettingsIcon />
                        {isSetting ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
                {/* <Drawer
                        anchor="top"
                        open={isSetting}
                        onClose={() => setIsSetting(false)}
                        variant="persistent"
                        sx={{
                            "& .MuiDrawer-root": {
                                position: "absolute",
                                zIndex: 1300,
                                right: 0,
                                top: 0,
                                height: "100%",
                            },
                            "& .MuiDrawer-paper": {
                                position: "absolute",
                                width: "80%",
                                height: "100%",
                                boxSizing: "border-box",
                                borderLeft: "1px solid #ddd",
                            },
                        }}></Drawer> */}
            </Box>

            {isSearch && (
                <Box
                    display="flex"
                    alignContent="space-between"
                    alignItems="center"
                    sx={{ width: "100%", pl: 1, py: 1 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            width: "100%",
                            height: "100%",
                        }}>
                        <SearchIcon />
                        <TextField
                            multiline
                            variant="standard"
                            value={searchInputValue}
                            placeholder="채팅방, 참여자 검색"
                            onChange={(e) =>
                                setSearchInputValue(e.target.value)
                            }
                            sx={{ mb: 0.5, ml: 1, width: "90%" }}
                        />
                    </Stack>
                    <IconButton>
                        <CloseIcon onClick={() => setIsSearch(false)} />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}

export default RoomListHeader;
