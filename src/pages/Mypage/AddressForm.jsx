import React, { useState } from "react";
import {
    Stack,
    TextField,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    InputAdornment,
} from "@mui/material";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../../store/useToastStore";
import { changeAddress } from "../../apis/account/accountService";

const AddressForm = ({ userId, onClose }) => {
    const queryClient = useQueryClient();
    const { show } = useToastStore();
    const [addressInputValue, setAddressInputValue] = useState({
        zipCode: "",
        baseAddress: "",
        detailAddress: "",
    });
    const [error, setError] = useState("");

    const updateMutation = useMutation({
        mutationFn: (address) =>
            changeAddress({
                userId: userId,
                ...address,
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

    const openPostcode = useDaumPostcodePopup(
        "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js",
    );

    const handleAddressComplete = (data) => {
        setAddressInputValue((prev) => ({
            ...prev,
            zipCode: data.zonecode,
            baseAddress: data.address,
        }));
        if (error.address) {
            setError((prev) => ({ ...prev, address: "" }));
        }
    };

    const handleAddressSearch = () => {
        openPostcode({ onComplete: handleAddressComplete });
    };

    const handleChange = (e) => {
        setAddressInputValue({
            ...addressInputValue,
            detailAddress: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (!addressInputValue.zipCode || !addressInputValue.detailAddress) {
            setError("주소와 상세주소를 모두 입력해주세요.");
            return;
        }

        if (!confirm("주소를 변경하시겠습니까?")) return;

        updateMutation.mutate(addressInputValue);
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>주소 변경</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Stack direction="row">
                        <TextField
                            placeholder="우편번호"
                            value={addressInputValue.zipCode || ""}
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button onClick={handleAddressSearch}>
                                            주소 검색
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                    <TextField
                        fullWidth
                        placeholder="기본 주소"
                        value={addressInputValue.baseAddress || ""}
                        variant="outlined"
                        size="small"
                        inputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        placeholder="상세 주소 (예: 101동 101호)"
                        value={addressInputValue.detailAddress || ""}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        error={!!error}
                        helperText={error}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button variant="outlined" onClick={onClose}>
                    취소
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        !addressInputValue.zipCode ||
                        !addressInputValue.detailAddress
                    }>
                    변경 완료
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddressForm;
