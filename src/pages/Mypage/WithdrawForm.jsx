import React from 'react';
import { Typography, Button, Dialog, DialogContent, DialogTitle, DialogActions, Box, Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "../../store/useToastStore";
import { withdraw } from '../../apis/account/accountService';

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
        }
    });

    return (
        <Dialog 
            open={true} 
            onClose={onClose} 
            fullWidth 
            maxWidth="xs" 
        >
            <DialogTitle>회원 탈퇴</DialogTitle>

            <DialogContent>
                <Box sx={{ 
                    py: 3, 
                    textAlign: 'center', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1 
                }}>
                    <Typography variant="body1">
                        정말로 탈퇴하시겠습니까?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        탈퇴 시 모든 정보가 삭제됩니다.
                    </Typography>
                </Box>
            </DialogContent>

            {/* 3. 하단 버튼 액션 */}
            <DialogActions sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} width="100%">
                    <Button 
                        variant="outlined" 
                        onClick={onClose}
                        fullWidth
                        size="large"
                        disabled={deleteMutation.isPending}
                        sx={{ color: '#666', borderColor: '#bbb' }}
                    >
                        취소
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => deleteMutation.mutate()}
                        fullWidth
                        size="large"
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "처리 중..." : "탈퇴하기"}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

export default WithdrawForm;