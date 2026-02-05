import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    DialogContentText,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "../../store/useToastStore";
import { withdraw } from "../../apis/account/accountService";

function WithdrawForm({ userId, onClose, onLogout }) {
    const navigate = useNavigate();
    const { show } = useToastStore();
    const queryClient = useQueryClient();

    const handleLogout = () => {
        onClose();
        onLogout();
        queryClient.clear();
        navigate("/");
    };

    const deleteMutation = useMutation({
        mutationFn: () => withdraw(userId),
        onSuccess: (res) => {
            show(res.message, "success");

            setTimeout(() => {
                handleLogout();
            }, 1500);
        },
        onError: (error) => {
            show(error.message, "error");
        },
    });

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>회원 탈퇴</DialogTitle>

            <DialogContent>
                <DialogContentText variant="body1" mb={1}>
                    정말로 탈퇴하시겠습니까?
                </DialogContentText>
                <DialogContentText variant="body2" color="text.secondary">
                    탈퇴 시 모든 정보가 삭제됩니다.
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    size="large"
                    color="error"
                    disabled={deleteMutation.isPending}>
                    취소
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteMutation.mutate()}
                    size="large"
                    disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? "처리 중..." : "탈퇴하기"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default WithdrawForm;
