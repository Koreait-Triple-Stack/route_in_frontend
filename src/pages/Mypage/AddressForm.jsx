import React, { useState } from 'react';
import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { changeAddressRequest } from "../../apis/account/accountApi"; 
import OverlayWrapper from './OverlayWrapper';

const AddressForm = ({ userId, onClose }) => {
    const [addressInputValue, setAddressInputValue] = useState({
        zipCode: "",
        baseAddress: "",
        detailAddress: ""
    });
    const [error, setError] = useState("");

    const openPostcode = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');

    const handleAddressComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') extraAddress += data.bname;
            if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setAddressInputValue(prev => ({
            ...prev,
            zipCode: data.zonecode,
            baseAddress: fullAddress,
            detailAddress: '' 
        }));
        setError("");
    };

    const handleAddressSearch = () => {
        openPostcode({ onComplete: handleAddressComplete });
    };

    const handleChange = (e) => {
        setAddressInputValue({ ...addressInputValue, detailAddress: e.target.value });
    };

    const handleSubmit = () => {
        if(!addressInputValue.zipCode || !addressInputValue.detailAddress) {
            setError("주소와 상세주소를 모두 입력해주세요.");
            return;
        }

        if (!confirm("주소를 변경하시겠습니까?")) return;

        changeAddressRequest({
            userId: userId,
            ...addressInputValue
        })
        .then((response) => {
            if (response.data.status === "success") {
                alert(response.data.message);
                onClose(); 
            } else {
                alert(response.data.message);
            }
        })
        .catch(() => alert("오류가 발생했습니다."));
    };

    return (
        <OverlayWrapper title="주소 변경" onClose={onClose}>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    새로운 주소를 입력해주세요.
                </Typography>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            placeholder="우편번호"
                            value={addressInputValue.zipCode || ""}
                            variant="outlined" size="small" fullWidth
                            inputProps={{ readOnly: true }} 
                        />
                        <Button variant="outlined" onClick={handleAddressSearch} sx={{ whiteSpace: 'nowrap', minWidth: '80px' }}>
                            주소 검색
                        </Button>
                    </Stack>
                    <TextField
                        fullWidth placeholder="기본 주소"
                        value={addressInputValue.baseAddress || ""}
                        variant="outlined" size="small"
                        inputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth placeholder="상세 주소 (예: 101동 101호)"
                        value={addressInputValue.detailAddress || ""}
                        onChange={handleChange}
                        variant="outlined" size="small"
                        error={!!error} helperText={error}
                    />
                </Stack>
                <Button 
                    variant="contained" fullWidth size="large" sx={{ mt: 3 }}
                    onClick={handleSubmit}
                    disabled={!addressInputValue.zipCode || !addressInputValue.detailAddress}
                >
                    변경 완료
                </Button>
            </Box>
        </OverlayWrapper>
    );
};

export default AddressForm;