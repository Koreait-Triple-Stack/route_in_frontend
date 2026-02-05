import React, { useState } from "react";
import {
    TextField,
    Button,
    DialogActions,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import { changeBodyInfo } from "../../apis/account/accountService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../../store/useToastStore";

const BodyInfoForm = ({ userId, onClose }) => {
    const queryClient = useQueryClient();
    const { show } = useToastStore();
    const [bodyInfo, setBodyInfo] = useState({
        height: "",
        weight: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBodyInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateMutation = useMutation({
        mutationFn: (bodyInfo) =>
            changeBodyInfo({
                userId: userId,
                ...bodyInfo,
            }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(["getUserByUserId", userId]);
            show(res.message, "success");
            onClose();
        },
        onError: (error) => {
            show(error.message, "error");
        },
    });

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>키/몸무게 변경</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    name="height"
                    label="키 (cm)"
                    variant="outlined"
                    value={bodyInfo.height}
                    onChange={handleChange}
                    placeholder="숫자만 입력해주세요."
                    sx={{ mb: 3, mt: 1 }}
                />

                <TextField
                    fullWidth
                    name="weight"
                    label="몸무게 (kg)"
                    variant="outlined"
                    value={bodyInfo.weight}
                    onChange={handleChange}
                    placeholder="숫자만 입력해주세요."
                    sx={{ mb: 1 }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button variant="outlined" onClick={onClose}>
                    취소
                </Button>
                <Button
                    variant="contained"
                    onClick={() => updateMutation.mutate(bodyInfo)}
                    disabled={!bodyInfo.height || !bodyInfo.weight}>
                    변경 완료
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BodyInfoForm;
