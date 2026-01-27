import React, { use, useState } from "react";
import {
    Box,
    ListItemText,
    Typography,
    IconButton,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    Divider,
    TextField,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Stack } from "@mui/system";
import ChatList from "./ChatList";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { getFollowerUserList, getFollowingUserList } from "../../apis/follow/followService";
import FollowUserList from "./FollowUserList";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";

function ChatListPage() {
    const { principal } = usePrincipalState();
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isNewChat, setIsNewChat] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [isFollow, setIsFollow] = useState("");

    const handleLeaveChat = () => {
        if (window.confirm("정말 이 채팅방을 나가시겠습니까?")) {
            console.log(selectedChatId, "번 방 나가기 처리");
            // 여기에 나가기 API 호출 로직 추가
        }
        handleClose();
    };
    // 메뉴 닫기
    const handleClose = () => {
        setContextMenu(null);
        setSelectedChatId(null);
    };

    const handleAddChatRoom = () => {};

    return (
        <Box sx={{ width: "100%", height: "100%", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
            {/* 상단 헤더 (기존 동일) */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: "#fff", color: "#000", pt: 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mr: 1 }}>
                            채팅
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton size="large" sx={{ color: "#000" }}>
                            <SearchIcon onClick={() => setIsSearch(true)} />
                        </IconButton>
                        <IconButton size="large" sx={{ color: "#000" }}>
                            <ChatBubbleOutlineIcon onClick={() => setIsNewChat(true)} />
                        </IconButton>
                        <IconButton size="large" sx={{ color: "#000" }}>
                            <SettingsIcon onClick={() => setIsSetting(!isSetting)} />
                            {isSetting ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        <Drawer
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
                            }}
                        ></Drawer>
                    </Box>
                </Toolbar>
            </AppBar>

            {isSearch && (
                <Box display="flex" alignContent="space-between" alignItems="center" sx={{ width: "94%", height: "8%", pl: 3 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            pl: 2,
                            bgcolor: "#f9f9f9",
                            border: "1px solid #e0e0e0",
                            borderRadius: 12,
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <SearchIcon />
                        <TextField
                            multiline
                            variant="standard"
                            value={searchInputValue}
                            placeholder="채팅방, 참여자 검색"
                            onChange={(e) => setSearchInputValue(e.target.value)}
                            sx={{ mb: 0.5, ml: 1, width: "90%" }}
                        />
                    </Stack>
                    <IconButton>
                        <CloseIcon onClick={() => setIsSearch(false)} />
                    </IconButton>
                </Box>
            )}

            <Dialog
                open={isNewChat}
                onClose={() => setIsNewChat(false)}
                PaperProps={{
                    sx: {
                        height: "100%",
                        width: "100%",
                    },
                }}
            >
                <DialogTitle>대화상대 선택</DialogTitle>
                <DialogContent>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            pl: 2,
                            bgcolor: "#f9f9f9",
                            border: "1px solid #e0e0e0",
                            borderRadius: 12,
                            width: "100%",
                            height: "8%",
                            mb: 2,
                        }}
                    >
                        <SearchIcon />
                        <TextField
                            multiline
                            variant="standard"
                            value={searchInputValue}
                            placeholder="이름 검색"
                            onChange={(e) => setSearchInputValue(e.target.value)}
                            sx={{ mb: 0.5, ml: 1, width: "90%" }}
                        />
                    </Stack>
                    <Stack direction="row" alignItems="center" alignContent="space-around" sx={{ mb: 2 }}>
                        <Button fullWidth onClick={() => setIsFollow("follwer")}>
                            팔로우 목록
                        </Button>
                        <Button fullWidth onClick={() => setIsFollow("follwing")}>
                            팔로워 목록
                        </Button>
                    </Stack>
                    {isFollow === "follwer" ? (
                        <FollowUserList queryKeyPrefix={"getFollowerUserList"} queryFn={getFollowerUserList} emptyText="팔로워가 없습니다." mode={"followers"} />
                    ) : (
                        <FollowUserList queryKeyPrefix={"getFollowingUserList"} queryFn={getFollowingUserList} emptyText="팔로잉이 없습니다." mode={"following"} />
                    )}

                    <Stack spacing={2}></Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" fullWidth size="large" onClick={() => setIsNewChat(false)}>
                            취소
                        </Button>
                        <Button variant="contained" fullWidth size="large" onClick={() => navigate("/chat/room")}>
                            확인
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <ChatList contextMenu={contextMenu} setContextMenu={setContextMenu} setSelectedChatId={setSelectedChatId} />

            {/* ✅ 꾹 눌렀을 때 뜨는 메뉴 (Context Menu) */}
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
                PaperProps={{
                    style: { width: 200 }, // 메뉴 너비
                }}
            >
                <MenuItem onClick={handleClose}>
                    <ListItemText>채팅방 이름 설정</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemText>즐겨찾기에 추가</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemText>채팅방 알림 끄기</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLeaveChat} sx={{ color: "#d32f2f" }}>
                    <ListItemText>나가기</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default ChatListPage;
