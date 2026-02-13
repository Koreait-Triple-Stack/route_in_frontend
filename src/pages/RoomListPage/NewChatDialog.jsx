import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    ToggleButton,
    ToggleButtonGroup,
    Fab,
} from "@mui/material";
import {
    getFollowerUserList,
    getFollowingUserList,
} from "../../apis/follow/followService";
import SearchIcon from "@mui/icons-material/Search";
import { Stack } from "@mui/system";
import FollowUserList from "./FollowUserList";
import { useMutation } from "@tanstack/react-query";
import { addRoomRequest } from "../../apis/chat/chatApi";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "../../store/useToastStore";
import { usePrincipalState } from "../../store/usePrincipalState";
import { BUTTON_COLOR } from "../../constants/design";
import { NAV_H } from "../../components/BasicBottomNav";
import { HiOutlineChat } from "react-icons/hi";

function NewChatDialog({ isNewChat, setIsNewChat }) {
    const { show } = useToastStore();
    const { principal } = usePrincipalState();
    const navigate = useNavigate();
    const [searchInputValue, setSearchInputValue] = useState("");
    const [isFollow, setIsFollow] = useState("follower");
    const [selectedIds, setSelectedIds] = useState([principal.userId]);
    const [usernames, setUsernames] = useState([principal.username]);
    const mutation = useMutation({
        mutationFn: (data) => addRoomRequest(data),
        onSuccess: (resp) => {
            navigate(`/chat/room/${resp.data}`);
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const onClickHandler = () => {
        if (selectedIds.length === 1) {
            show("한명 이상을 선택해주세요", "error");
            return;
        }

        mutation.mutate({
            usernames: usernames,
            userIds: selectedIds,
        });
    };

    const followOnChangeHandler = (e, newValue) => {
        if (newValue !== null) setIsFollow(newValue);
    };

    const onClose = () => {
        setSelectedIds([]);
        setIsNewChat(false);
    };

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    right: 16,
                    bottom: NAV_H + 20,
                    zIndex: 1300,
                    px: 1,
                    pointerEvents: "none",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        pointerEvents: "auto",
                    }}>
                    <Fab
                        onClick={() => setIsNewChat(true)}
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: BUTTON_COLOR,
                            color: "#fff",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                        }}>
                        <HiOutlineChat size={26} />
                    </Fab>
                </Box>
            </Box>

            <Dialog
                open={isNewChat}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        height: "100%",
                        width: "100%",
                    },
                }}>
                <DialogTitle>대화상대 선택</DialogTitle>
                <DialogContent>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            py: 2,
                            width: "100%",
                            height: "8%",
                            mb: 2,
                        }}>
                        <SearchIcon />
                        <TextField
                            multiline
                            variant="standard"
                            value={searchInputValue}
                            placeholder="이름 검색"
                            onChange={(e) =>
                                setSearchInputValue(e.target.value)
                            }
                            sx={{ mb: 0.5, width: "100%" }}
                        />
                    </Stack>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 1,
                        }}>
                        <ToggleButtonGroup
                            exclusive
                            value={isFollow}
                            onChange={followOnChangeHandler}
                            sx={{ width: "94%" }}>
                            <ToggleButton
                                fullWidth
                                value="follower"
                                sx={{ color: "ButtonText" }}>
                                팔로워 목록
                            </ToggleButton>
                            <ToggleButton
                                fullWidth
                                value="following"
                                sx={{ color: "ButtonText" }}>
                                팔로잉 목록
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <FollowUserList
                        queryKeyPrefix={
                            isFollow === "follower"
                                ? "getFollowerUserList"
                                : "getFollowingUserList"
                        }
                        queryFn={
                            isFollow === "follower"
                                ? getFollowerUserList
                                : getFollowingUserList
                        }
                        emptyText={
                            isFollow === "follower"
                                ? "팔로워가 없습니다."
                                : "팔로잉이 없습니다."
                        }
                        mode={
                            isFollow === "follower" ? "followers" : "following"
                        }
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        setUsernames={setUsernames}
                    />

                    <Stack spacing={2}></Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={onClose}>
                            취소
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={onClickHandler}>
                            확인
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default NewChatDialog;
