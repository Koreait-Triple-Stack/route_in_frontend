import React, { useState } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment } from "@mui/material";
import { useToastStore } from "../../store/useToastStore";
import { changeUsername, isDuplicatedUsername } from "../../apis/account/accountService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UsernameForm = ({ userId, onClose }) => {
    const queryClient = useQueryClient();
    const { show } = useToastStore();
    const [username, setUsername] = useState("");
    const [isDuplicated, setIsDuplicated] = useState(false);
    const [finalName, setFinalName] = useState("")

    const handleChange = (e) => {
        setUsername(e.target.value);
        if (isDuplicated) {
            setIsDuplicated(false);
        }
    };

    const updateMutation = useMutation({
        mutationFn: (username) => changeUsername({ userId: userId, username: username }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(["getUserByUserId", userId]);
            show(res.message, "success");
            onClose();
        },
        onError: (error) => {
            show(error.message, "error");
        },
    });

    const duplicatedHandler = async () => {
        const response = await isDuplicatedUsername(username);
        if (response?.data) {
            show("이미 있는 닉네임입니다.", "error");
        } else {
            setIsDuplicated(true);
            setFinalName(username);
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>닉네임 변경</DialogTitle>

            <DialogContent>
                <TextField
                    value={username}
                    onChange={handleChange}
                    placeholder="새 닉네임을 입력해주세요."
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={duplicatedHandler} disabled={isDuplicated}>중복확인</Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button variant="outlined" onClick={onClose} color="inherit">
                    취소
                </Button>
                <Button variant="contained" onClick={() => updateMutation.mutate(username)} disabled={!isDuplicated || username !== finalName}>
                    변경 완료
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UsernameForm;
