import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from "@mui/material";
import { changeBodyInfoRequest } from "../../apis/account/accountApi";
import OverlayWrapper from './OverlayWrapper';

const BodyInfoForm = ({ userId, onClose }) => {
    const [bodyInfo, setBodyInfo] = useState({
        height: "",
        weight: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBodyInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if(!bodyInfo.height || !bodyInfo.weight) {
             alert("모든 항목을 입력해주세요.");
             return;
        }
        
        if (!confirm("신체정보를 변경하시겠습니까?")) return;

        changeBodyInfoRequest({
            userId: userId,
            height: Number(bodyInfo.height), 
            weight: Number(bodyInfo.weight)
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
        <OverlayWrapper title="키/몸무게 변경" onClose={onClose}>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    새로운 신체정보를 입력해주세요.
                </Typography>

                <TextField
                    fullWidth
                    name="height"
                    label="키 (cm)"
                    variant="outlined"
                    value={bodyInfo.height}
                    onChange={handleChange}
                    placeholder="숫자만 입력해주세요."
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    name="weight"
                    label="몸무게 (kg)"
                    variant="outlined"
                    value={bodyInfo.weight}
                    onChange={handleChange}
                    placeholder="숫자만 입력해주세요."
                    sx={{ mb: 3 }}
                />

                <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    onClick={handleSubmit}
                    disabled={!bodyInfo.height || !bodyInfo.weight}
                >
                    변경 완료
                </Button>
            </Box>
        </OverlayWrapper>
    );
};

export default BodyInfoForm;