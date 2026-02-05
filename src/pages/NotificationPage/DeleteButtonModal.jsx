import { Box } from "@mui/system";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useState } from "react";
import { Fab } from "@mui/material";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotificationByUserId } from "../../apis/notification/notificationService";
import { BUTTON_COLOR } from "../../constants/design";
import { NAV_H } from "../../components/BasicBottomNav";
import DialogComponent from "../../components/DialogComponent";

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
        },
    });

    const onDeleteAll = () => {
        mutation.mutate(principal?.userId);
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
                        onClick={() => setOpenDeleteAll(true)}
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: BUTTON_COLOR,
                            color: "#fff",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                        }}>
                        <DeleteOutlineRoundedIcon />
                    </Fab>
                </Box>
            </Box>

            <DialogComponent
                open={openDeleteAll}
                setOpen={setOpenDeleteAll}
                title="전체 삭제"
                content={"모든 알림을 삭제할까요? 삭제하면 되돌릴 수 없어요."}
                onClick={onDeleteAll}
                color="error"
                ment="삭제"
            />
        </>
    );
}

export default DeleteButtonModal;
