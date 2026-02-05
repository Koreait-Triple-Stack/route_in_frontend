import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Menu,
    MenuItem,
    TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    changeRoomFavoriteRequest,
    changeRoomTitleRequest,
    muteNotificationRequest,
    quitRoomRequest,
    readRoomRequest,
} from "../../apis/chat/chatApi";
import { useToastStore } from "../../store/useToastStore";
import { usePrincipalState } from "../../store/usePrincipalState";
import DialogComponent from "../../components/DialogComponent";

function MenuModal({
    contextMenu,
    setContextMenu,
    selectedRoom,
    setSelectedRoom,
}) {
    const { show } = useToastStore();
    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();
    const [openChangeTitle, setOpenChangeTitle] = useState();
    const [openLeaveRoom, setOpenLeaveRoom] = useState();
    const [title, setTitle] = useState("");

    const readMutaition = useMutation({
        mutationFn: readRoomRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
            queryClient.invalidateQueries({
                queryKey: ["getRoomListByUserIdRequest", principal.userId],
            });
            queryClient.invalidateQueries({
                queryKey: ["countUnreadChatByUserIdRequest", principal.userId],
            });
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const titleMutation = useMutation({
        mutationFn: changeRoomTitleRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
            queryClient.invalidateQueries({
                queryKey: ["getRoomListByUserIdRequest", principal.userId],
            });
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const favoriteMutation = useMutation({
        mutationFn: changeRoomFavoriteRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
            queryClient.invalidateQueries({
                queryKey: ["getRoomListByUserIdRequest", principal.userId],
            });
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const muteMutation = useMutation({
        mutationFn: muteNotificationRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
            queryClient.invalidateQueries({
                queryKey: ["getRoomListByUserIdRequest", principal.userId],
            });
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const leaveRoomMutation = useMutation({
        mutationFn: quitRoomRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
            queryClient.invalidateQueries({
                queryKey: ["getRoomListByUserIdRequest", principal.userId],
            });
            queryClient.invalidateQueries({
                queryKey: ["countUnreadChatByUserIdRequest", principal.userId],
            });
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    useEffect(() => {
        if (!selectedRoom) return;
        setTitle(selectedRoom.title);
    }, [selectedRoom]);

    const handleRead = () => {
        readMutaition.mutate({
            roomId: selectedRoom.roomId,
            userId: selectedRoom.userId,
            lastMessageId: selectedRoom.lastMessageId,
        });

        handleClose();
    };

    const handleChangeTitle = () => {
        if (!title.trim()) {
            show("한 글자 이상 입력해 주세요", "error");
            return;
        }

        titleMutation.mutate({
            roomId: selectedRoom.roomId,
            userId: selectedRoom.userId,
            title,
        });

        handleClose();
    };

    const handleFavorite = () => {
        favoriteMutation.mutate({
            userId: selectedRoom.userId,
            roomId: selectedRoom.roomId,
            favorite: selectedRoom.favorite,
        });

        handleClose();
    };

    const handleMute = () => {
        muteMutation.mutate({
            userId: selectedRoom.userId,
            roomId: selectedRoom.roomId,
            muteNotification: selectedRoom.muteNotification,
        });

        handleClose();
    };

    const handleLeaveRoom = () => {
        leaveRoomMutation.mutate({
            roomId: selectedRoom.roomId,
            userId: selectedRoom.userId,
            username: principal.username,
        });
        handleClose();
    };

    const handleClose = () => {
        setContextMenu(null);
        setOpenChangeTitle(false);
        setOpenLeaveRoom(false);
        setTimeout(() => {
            setSelectedRoom(null);
        }, 120);
    };

    return (
        <>
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
                PaperProps={{
                    style: { width: 200 },
                }}>
                <MenuItem onClick={handleRead}>읽음 처리</MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenChangeTitle(true);
                        setContextMenu(null);
                    }}>
                    채팅방 이름 설정
                </MenuItem>
                <MenuItem onClick={handleFavorite}>
                    즐겨찾기 {selectedRoom?.favorite ? "삭제" : "추가"}
                </MenuItem>
                <MenuItem onClick={handleMute}>
                    채팅방 알림{" "}
                    {selectedRoom?.muteNotification ? "켜기" : "끄기"}
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => {
                        setOpenLeaveRoom(true);
                        setContextMenu(null);
                    }}
                    sx={{
                        color: "error.main",
                        "& .MuiListItemIcon-root": {
                            color: "error.main",
                        },
                        "& .MuiListItemText-primary": {
                            color: "error.main",
                            fontWeight: 700,
                        },
                        "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
                    }}>
                    나가기
                </MenuItem>
            </Menu>

            <Dialog
                open={openChangeTitle}
                onClose={() => {
                    handleClose();
                }}
                fullWidth
                maxWidth="xs">
                <DialogTitle>채팅방 이름 수정</DialogTitle>

                <DialogContent>
                    <TextField
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        placeholder="채팅방 이름을 입력해주세요"
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            handleClose();
                        }}>
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleChangeTitle}
                        disabled={!title.trim()}>
                        변경 완료
                    </Button>
                </DialogActions>
            </Dialog>

            <DialogComponent
                open={openLeaveRoom}
                setOpen={setOpenLeaveRoom}
                title="채팅방 나가기"
                content={"채팅방을 나가시겠습니까?"}
                onClick={handleLeaveRoom}
                color="error"
                ment="나가기"
            />
        </>
    );
}

export default MenuModal;
