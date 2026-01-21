import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Paper, Typography, Box, TextField, Button, MenuItem, Select, FormControl, FormHelperText, InputAdornment, Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useDaumPostcodePopup } from "react-daum-postcode"; // 라이브러리 import
import { oAuth2Signup } from "../../apis/oAuth2/oAuth2Service";
import { useMutation } from "@tanstack/react-query";
import { Grid } from "@mui/system";

const OAuth2SignupPage = () => {
    const [searchParams] = useSearchParams();
    const provider = searchParams.get("provider");
    const providerUserId = searchParams.get("providerUserId");
    const mutation = useMutation({
        mutationFn: (data) => oAuth2Signup(data),
        onSuccess: (response) => {
            alert(response.message);
            window.location.href = "/";
        },
        onError: (error) => {
            alert(error);
        },
    });

    // 1. 주소 검색 팝업 훅 설정
    const open = useDaumPostcodePopup();

    const [formData, setFormData] = useState({
        username: "",
        birthDate: "",
        gender: "",
        zipCode: "",
        baseAddress: "",
        detailAddress: "",
        height: "",
        weight: "",
    });

    const [errors, setErrors] = useState({});

    const handleAddressComplete = (data) => {
        setFormData((prev) => ({
            ...prev,
            zipCode: data.zonecode,
            baseAddress: data.address,
        }));

        if (errors.address) {
            setErrors((prev) => ({ ...prev, address: "" }));
        }
    };

    const handleAddressSearch = () => {
        open({ onComplete: handleAddressComplete });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "birthDate") {
            newValue = value.replace(/[^0-9]/g, "").slice(0, 8);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSignup = async () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = "닉네임을 입력해주세요.";
        if (formData.birthDate.length !== 8) newErrors.birthDate = "생년월일 8자리를 입력해주세요.";
        if (!formData.gender) newErrors.gender = "성별을 선택해주세요.";

        // [수정] 주소 유효성 검사 (우편번호나 상세주소 체크)
        if (!formData.zipCode || !formData.baseAddress) {
            newErrors.address = "주소를 검색해주세요.";
        } else if (!formData.detailAddress.trim()) {
            newErrors.detailAddress = "상세주소를 입력해주세요.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (!confirm("회원가입하시겠습니까?")) return;

        const formattedBirthDate = `${formData.birthDate.slice(0, 4)}-${formData.birthDate.slice(4, 6)}-${formData.birthDate.slice(6, 8)}`;

        mutation.mutate({
            username: formData.username,
            birthDate: formattedBirthDate,
            gender: formData.gender,
            height: Number(formData.height),
            weight: Number(formData.weight),
            provider: provider,
            providerUserId: providerUserId,
            address: {
                zipCode: formData.zipCode,
                baseAddress: formData.baseAddress,
                detailAddress: formData.detailAddress,
            },
        });
    };

    const Label = ({ children, required }) => (
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            {children} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </Typography>
    );

    return (
        <Container>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #eee" }}>
                <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 700 }}>
                    회원가입
                </Typography>

                <Box component="form" noValidate sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                        <Label required>닉네임</Label>
                        <TextField
                            fullWidth
                            name="username"
                            placeholder="닉네임을 입력해주세요"
                            value={formData.username}
                            onChange={handleInputChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            variant="outlined"
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                        />
                    </Box>

                    <Box>
                        <Label required>생년월일</Label>
                        <TextField
                            fullWidth
                            name="birthDate"
                            placeholder="예) 19990101"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate}
                            variant="outlined"
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                            inputProps={{ inputMode: "numeric", maxLength: 8 }}
                        />
                    </Box>

                    <Box>
                        <Label required>성별</Label>
                        <ToggleButtonGroup value={formData.gender} exclusive onChange={handleInputChange}>
                            <Grid container spacing={1}>
                                <ToggleButton name="gender" value="남성">
                                    남성
                                </ToggleButton>
                                <ToggleButton name="gender" value="여성">
                                    여성
                                </ToggleButton>
                            </Grid>
                        </ToggleButtonGroup>
                    </Box>

                    {/* [수정된 부분] 주소 입력 영역 (우편번호, 기본주소, 상세주소) */}
                    <Box>
                        <Label required>주소</Label>
                        <Stack spacing={1}>
                            {/* 우편번호 + 검색 버튼 */}
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    placeholder="우편번호"
                                    value={formData.zipCode}
                                    variant="outlined"
                                    onClick={handleAddressSearch}
                                    size="small"
                                    fullWidth
                                    // 사용자가 직접 수정 못하게 readOnly 설정
                                    InputProps={{
                                        readOnly: true,
                                        sx: {
                                            borderRadius: 2,
                                            bgcolor: "#f8f9fa",
                                        },
                                    }}
                                    error={!!errors.address}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleAddressSearch}
                                    sx={{
                                        borderRadius: 2,
                                        whiteSpace: "nowrap",
                                        minWidth: "80px",
                                    }}
                                >
                                    주소 검색
                                </Button>
                            </Stack>

                            {/* 기본 주소 */}
                            <TextField
                                fullWidth
                                placeholder="기본 주소"
                                onClick={handleAddressSearch}
                                value={formData.baseAddress}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                    sx: { borderRadius: 2, bgcolor: "#f8f9fa" },
                                }}
                                error={!!errors.address}
                            />

                            {/* 상세 주소 */}
                            <TextField
                                fullWidth
                                name="detailAddress"
                                placeholder="상세 주소를 입력해주세요 (예: 101동 101호)"
                                value={formData.detailAddress}
                                onChange={handleInputChange}
                                variant="outlined"
                                size="small"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                }}
                                error={!!errors.detailAddress}
                                helperText={errors.detailAddress} // 에러 메시지는 상세주소 밑에 표시
                            />
                        </Stack>
                    </Box>

                    <Box>
                        <Label>키 (cm)</Label>
                        <TextField
                            fullWidth
                            name="height"
                            placeholder="예: 175"
                            value={formData.height}
                            onChange={handleInputChange}
                            error={!!errors.height}
                            helperText={errors.height}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                sx: { borderRadius: 2 },
                            }}
                        />
                    </Box>

                    <Box>
                        <Label>몸무게 (kg)</Label>
                        <TextField
                            fullWidth
                            name="weight"
                            placeholder="예: 70"
                            value={formData.weight}
                            onChange={handleInputChange}
                            error={!!errors.weight}
                            helperText={errors.weight}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                sx: { borderRadius: 2 },
                            }}
                        />
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleSignup}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: "bold",
                            fontSize: "1rem",
                            bgcolor: "#2563eb",
                            "&:hover": { bgcolor: "#1d4ed8" },
                        }}
                    >
                        가입하기
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default OAuth2SignupPage;
