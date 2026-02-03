import React, { use, useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import {
    getFollowerUserList,
    getFollowingUserList,
} from "../../apis/follow/followService";
import SearchIcon from "@mui/icons-material/Search";
import { Stack } from "@mui/system";
import FollowUserList from "./FollowUserList";
import { useMutation } from "@tanstack/react-query";
import { addRoomParticipantRequest } from "../../apis/chat/chatApi";
import { useToastStore } from "../../store/useToastStore";

function InviteDialog({
    isInvite,
    setIsInvite,
    setIsMenu,
    participants,
    roomId,
}) {
    const { show } = useToastStore();
    const [searchInputValue, setSearchInputValue] = useState("");
    const [isFollow, setIsFollow] = useState("follower");
    const [userIds, setUserIds] = useState([]);
    const [usernames, setUsernames] = useState([]);
    const inviteMutation = useMutation({
        mutationFn: addRoomParticipantRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    useEffect(() => {
        if (!participants) return;
        setUsernames(participants.map(part => part.username));
        setUserIds(participants.map(part => part.userId))
    }, [participants]);

    const onClickHandler = async () => {
        if (userIds.length === participants.length) {
            show("한명 이상을 선택해주세요");
            return;
        }

        inviteMutation.mutate({
            roomId: roomId,
            usernames: usernames,
            userIds: userIds,
        });

        onClose();
        setIsMenu(false);
    };

    const followOnChangeHandler = (e) => {
        setIsFollow(e.target.value);
    };

    const onClose = () => {
        setIsInvite(false);
        setIsFollow("follower");
        setUserIds([]);
        setUsernames([])
    };

    return (
        <Dialog
            open={isInvite}
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
                        pl: 2,
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
                        onChange={(e) => setSearchInputValue(e.target.value)}
                        sx={{ mb: 0.5, ml: 1, width: "90%" }}
                    />
                </Stack>

                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                    <ToggleButtonGroup
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
                    mode={isFollow === "follower" ? "followers" : "following"}
                    userIds={userIds}
                    setUserIds={setUserIds}
                    setUsernames={setUsernames}
                    participantIds={
                        new Set(
                            participants.map((part) =>
                                Number(part.userId),
                            ),
                        )
                    }
                />

                <Stack spacing={2}></Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" size="large" onClick={onClose}>
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
    );
}

export default InviteDialog;
