import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useToastStore } from "../../store/useToastStore";
import { useMutation } from "@tanstack/react-query";
import {
    changeMessageRequest,
    deleteMessageRequest,
} from "../../apis/chat/chatApi";
import { usePrincipalState } from "../../store/usePrincipalState";

function MessageModal({
    contextMenuMes,
    setContextMenuMes,
    selectedMessage,
    setSelectedMessage,
}) {
    const { show } = useToastStore();
    const { principal } = usePrincipalState();
    const [content, setContent] = useState("");
    const [openChange, setOpenChange] = useState(false);
    const [openDeltete, setOpenDelete] = useState(false);

    useEffect(() => {
        if (!selectedMessage) {
            setContent("");
        } else {
            setContent(selectedMessage.content);
        }
    }, [selectedMessage]);

    const changeMutation = useMutation({
        mutationFn: changeMessageRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const deleteMutaion = useMutation({
        mutationFn: deleteMessageRequest,
        onSuccess: (resp) => {
            show(resp.message, "success");
        },
        onError: (resp) => {
            show(resp.message, "error");
        },
    });

    const handleChangeMessage = () => {
        changeMutation.mutate({
            messageId: selectedMessage.messageId,
            senderId: selectedMessage.senderId,
            content: content,
        });
        handleClose();
    };

    const handleDeleteMessage = () => {
        deleteMutaion.mutate(selectedMessage.messageId);
        handleClose();
    };

    const handleKeyDown = (e) => {
        if (e.nativeEvent.isComposing) return;

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChangeMessage();
        }
    };

    const handleClose = () => {
        setSelectedMessage(null);
        setContextMenuMes(null);
        setOpenChange(false);
        setOpenDelete(false);
    };

    return (
        <>
            <Menu
                open={contextMenuMes !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                disableAutoFocusItem
                anchorPosition={
                    contextMenuMes !== null
                        ? {
                              top: contextMenuMes.mouseY,
                              left: contextMenuMes.mouseX,
                          }
                        : undefined
                }
                slotProps={{
                    list: {
                        sx: { minWidth: 75, py: 0.5 },
                    },
                }}>
                <MenuItem
                    onClick={() => setOpenChange(true)}
                    disabled={selectedMessage?.senderId !== principal?.userId}>
                    수정
                </MenuItem>
                <MenuItem
                    onClick={() => setOpenDelete(true)}
                    disabled={selectedMessage?.senderId !== principal?.userId}
                    sx={{ color: "error.main" }}>
                    삭제
                </MenuItem>
            </Menu>

            <Dialog
                open={openChange}
                onClose={() => {
                    handleClose();
                }}
                fullWidth
                maxWidth="xs">
                <DialogTitle>메세지 수정</DialogTitle>

                <DialogContent>
                    <TextField
                        value={content}
                        multiline
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        placeholder="수정할 메시지를 입력해주세요"
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
                        onClick={handleChangeMessage}
                        disabled={!content.trim()}>
                        변경 완료
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeltete}
                onClose={() => {
                    handleClose();
                }}
                fullWidth
                maxWidth="xs">
                <DialogTitle>메시지 삭제</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        삭제한 메시지는 복원할 수 없습니다
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            handleClose();
                        }}>
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteMessage}>
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MessageModal;
