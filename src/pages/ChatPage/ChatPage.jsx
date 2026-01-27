import React, { use, useState } from "react";
import { Box, ListItemText, Typography, IconButton, AppBar, Toolbar, Menu, MenuItem, Divider, TextField, Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Stack } from "@mui/system";
import ChatList from "./ChatList";
import CloseIcon from "@mui/icons-material/Close";

import { getFollowerUserList, getFollowingUserList } from "../../apis/follow/followService";
import { usePrincipalState } from "../../store/usePrincipalState";
import FollowUserList from "./FollowUserList";

function ChatListPage() {
    const { principal } = usePrincipalState();
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isNewChat, setIsNewChat] = useState(false);
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
                            <SettingsIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {isSearch && (
                <Box display="flex" alignContent="space-between" alignItems="center" sx={{ width: "94%", height: "6%", pl: 3 }}>
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
                <DialogTitle>
                    대화상대 선택
                    <Stack direction="row" spacing={2}>
                        <Button onClick={() => setIsFollow("follwer")}>팔로우 목록</Button>
                        <Button onClick={() => setIsFollow("follwing")}>팔로잉 목록</Button>
                    </Stack>
                </DialogTitle>
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
                            mb: 2
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
                    {isFollow === "follwer" ? (
                        <FollowUserList queryKeyPrefix={"getFollowerUserList"} queryFn={getFollowerUserList} emptyText="팔로워가 없습니다." mode={"followers"} />
                    ) : (
                        <FollowUserList queryKeyPrefix={"getFollowingUserList"} queryFn={getFollowingUserList} emptyText="팔로잉이 없습니다." mode={"following"} />
                    )}

                    <Stack spacing={2}></Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" fullWidth size="large">
                            확인
                        </Button>
                        <Button variant="outlined" fullWidth size="large" onClick={() => setIsNewChat(false)}>
                            취소
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
