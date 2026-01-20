import { Box } from "@mui/system";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Button from "@mui/material/Button";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Fab, Typography } from "@mui/material";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotificationByUserId } from "../../apis/notification/notificationService";

function DeleteButtonModal() {
    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();
    const [openDeleteAll, setOpenDeleteAll] = useState(false);
    const mutation = useMutation({
        mutationFn: () => deleteNotificationByUserId(principal?.userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getNotificationListByUserId", principal.userId],
            });
        }
    })

    const onDeleteAll = () => {
        mutation.mutate(principal?.userId)
    };

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    right: 16,
                    bottom: 56 + 16, // BottomNav(56) 위로 16px
                    zIndex: 1300,
                    px: 1,
                    pointerEvents: "none", // ✅ 박스는 클릭 막고
                }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        pointerEvents: "auto",
                    }}>
                    <Fab
                        onClick={() => setOpenDeleteAll(true)}
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: "grey.200",
                            color: "text.primary",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                            "&:hover": { bgcolor: "grey.300" },
                        }}>
                        <DeleteOutlineRoundedIcon />
                    </Fab>
                </Box>
            </Box>

            <Dialog
                open={openDeleteAll}
                onClose={() => setOpenDeleteAll(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: 3, p: 0.5 },
                }}>
                <DialogTitle sx={{ fontWeight: 900 }}>전체 삭제</DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Typography
                        sx={{ color: "text.secondary", lineHeight: 1.5 }}>
                        모든 알림을 삭제할까요? 삭제하면 되돌릴 수 없어요.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setOpenDeleteAll(false)}
                        sx={{ borderRadius: 2, py: 1.1, fontWeight: 800 }}>
                        취소
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onDeleteAll(); // ✅ 너가 가진 전체삭제 함수
                            setOpenDeleteAll(false);
                        }}
                        sx={{ borderRadius: 2, py: 1.1, fontWeight: 900 }}>
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeleteButtonModal;
