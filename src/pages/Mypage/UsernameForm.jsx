import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from "@mui/material";
import { changeUsernameRequest } from "../../apis/account/accountApi"; 
import OverlayWrapper from './OverlayWrapper';

const UsernameForm = ({ userId, onClose }) => {
    const [username, setUsername] = useState("");

    const handleChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = () => {
        if (!confirm("username을 변경하시겠습니까?")) return;

        changeUsernameRequest({
            userId: userId,
            username: username,
        })
        .then((response) => {
            if (response.status === "success") {
                alert(response.message);
                onClose(); 
            } else {
                alert(response.message);
            }
        })
        .catch(() => {
            alert("문제가 발생했습니다. 다시 시도해주세요.");
        });
    };

    return (
        <OverlayWrapper title="닉네임 변경" onClose={onClose}>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    새로운 닉네임을 입력해주세요.
                </Typography>
                
                <TextField
                    fullWidth
                    label="새 닉네임"
                    variant="outlined"
                    value={username}
                    onChange={handleChange}
                    placeholder="새 닉네임을 입력해주세요."
                    sx={{ mb: 3 }}
                />

                <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    onClick={handleSubmit}
                    disabled={!username} 
                >
                    변경 완료
                </Button>
            </Box>
        </OverlayWrapper>
    );
};

export default UsernameForm;