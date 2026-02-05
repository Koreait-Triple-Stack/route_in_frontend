import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    InputAdornment,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    Divider,
} from "@mui/material";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { oAuth2Signup } from "../../apis/oAuth2/oAuth2Service";
import { useMutation } from "@tanstack/react-query";
import { Grid } from "@mui/system";

const OAuth2SignupPage = () => {
    const [searchParams] = useSearchParams();
    const provider = searchParams.get("provider");
    const providerUserId = searchParams.get("providerUserId");
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => oAuth2Signup(data),
        onSuccess: (response) => {
            alert(response.message);
            window.location.href = "/";
        },
        onError: (error) => alert(error),
    });

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
        if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
    };

    const handleAddressSearch = () =>
        open({ onComplete: handleAddressComplete });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "birthDate")
            newValue = value.replace(/[^0-9]/g, "").slice(0, 8);
        if (name === "height" || name === "weight")
            newValue = value.replace(/[^0-9]/g, "").slice(0, 3);

        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleGenderChange = (event, newValue) => {
        if (!newValue) return;
        setFormData((prev) => ({ ...prev, gender: newValue }));
        if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }));
    };

    const handleSignup = async () => {
        const newErrors = {};
        if (!formData.username.trim())
            newErrors.username = "닉네임을 입력해주세요.";
        if (formData.birthDate.length !== 8)
            newErrors.birthDate = "생년월일 8자리를 입력해주세요.";
        if (!formData.gender) newErrors.gender = "성별을 선택해주세요.";

        if (!formData.zipCode || !formData.baseAddress)
            newErrors.address = "주소를 검색해주세요.";
        else if (!formData.detailAddress.trim())
            newErrors.detailAddress = "상세주소를 입력해주세요.";

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        if (!confirm("회원가입하시겠습니까?")) return;

        const formattedBirthDate = `${formData.birthDate.slice(0, 4)}-${formData.birthDate.slice(4, 6)}-${formData.birthDate.slice(6, 8)}`;

        mutation.mutate({
            username: formData.username,
            birthDate: formattedBirthDate,
            gender: formData.gender,
            height: formData.height ? Number(formData.height) : null,
            weight: formData.weight ? Number(formData.weight) : null,
            provider,
            providerUserId,
            address: {
                zipCode: formData.zipCode,
                baseAddress: formData.baseAddress,
                detailAddress: formData.detailAddress,
            },
        });
    };

    const Label = ({ children, required, helper }) => (
        <Box
            sx={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                mb: 1,
            }}>
            <Typography
                variant="subtitle2"
                sx={{ fontWeight: 900, letterSpacing: -0.2 }}>
                {children}{" "}
                {required && (
                    <Box component="span" sx={{ color: "error.main" }}>
                        *
                    </Box>
                )}
            </Typography>
            {helper && (
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {helper}
                </Typography>
            )}
        </Box>
    );

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3.5,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}>
                <Box sx={{ textAlign: "center", mb: 2.5 }}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
                        회원가입
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mt: 0.6 }}>
                        기본 정보를 입력하면 가입이 완료돼요
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box
                    component="form"
                    noValidate
                    sx={{ display: "flex", flexDirection: "column", gap: 2.6 }}>
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
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                },
                            }}
                        />
                    </Box>

                    <Box>
                        <Label required helper="예) 19990101">
                            생년월일
                        </Label>
                        <TextField
                            fullWidth
                            name="birthDate"
                            placeholder="19990101"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate}
                            size="small"
                            inputProps={{ inputMode: "numeric", maxLength: 8 }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                },
                            }}
                        />
                    </Box>

                    <Box>
                        <Label required>성별</Label>
                        <ToggleButtonGroup
                            value={formData.gender}
                            exclusive
                            onChange={handleGenderChange}
                            fullWidth
                            sx={{
                                width: "100%",
                                gap: 1,
                                "& .MuiToggleButton-root": {
                                    flex: 1,
                                    borderRadius: 2.5,
                                    py: 1.1,
                                    fontWeight: 800,
                                    borderColor: "divider",
                                },
                                "& .MuiToggleButton-root.Mui-selected": {
                                    bgcolor: "primary.main",
                                    color: "#fff",
                                    borderColor: "primary.main",
                                    "&:hover": { bgcolor: "primary.dark" },
                                },
                            }}>
                            <ToggleButton value="남성">남성</ToggleButton>
                            <ToggleButton value="여성">여성</ToggleButton>
                        </ToggleButtonGroup>
                        {errors.gender && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "error.main",
                                    mt: 0.7,
                                    display: "block",
                                }}>
                                {errors.gender}
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    <Box>
                        <Label required>주소</Label>
                        <Stack spacing={1.2}>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    placeholder="우편번호"
                                    value={formData.zipCode}
                                    onClick={handleAddressSearch}
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2.5,
                                            bgcolor: "action.hover",
                                            cursor: "pointer",
                                        },
                                    }}
                                    error={!!errors.address}
                                />

                                <Button
                                    variant="contained"
                                    onClick={handleAddressSearch}
                                    sx={{
                                        borderRadius: 2.5,
                                        whiteSpace: "nowrap",
                                        px: 2,
                                        boxShadow: "none",
                                        "&:hover": { boxShadow: "none" },
                                    }}>
                                    주소 검색
                                </Button>
                            </Stack>

                            <TextField
                                fullWidth
                                placeholder="기본 주소"
                                onClick={handleAddressSearch}
                                value={formData.baseAddress}
                                size="small"
                                InputProps={{ readOnly: true }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2.5,
                                        bgcolor: "action.hover",
                                        cursor: "pointer",
                                    },
                                }}
                                error={!!errors.address}
                                helperText={errors.address}
                            />

                            <TextField
                                fullWidth
                                name="detailAddress"
                                placeholder="상세 주소를 입력해주세요 (예: 101동 101호)"
                                value={formData.detailAddress}
                                onChange={handleInputChange}
                                size="small"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2.5,
                                    },
                                }}
                                error={!!errors.detailAddress}
                                helperText={errors.detailAddress}
                            />
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                letterSpacing: -0.2,
                                mb: 1,
                            }}>
                            선택 정보
                        </Typography>

                        <Grid container spacing={1.2}>
                            <Grid item xs={6}>
                                <Label>키</Label>
                                <TextField
                                    fullWidth
                                    name="height"
                                    placeholder="175"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                cm
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2.5,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Label>몸무게</Label>
                                <TextField
                                    fullWidth
                                    name="weight"
                                    placeholder="70"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                kg
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2.5,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={() => navigate("/")}
                            sx={{
                                mt: 1,
                                py: 1.4,
                                borderRadius: 2.8,
                                fontWeight: 900,
                                letterSpacing: -0.2,
                                boxShadow: "0 12px 28px rgba(37,99,235,0.22)",
                                "&:hover": {
                                    boxShadow:
                                        "0 14px 30px rgba(37,99,235,0.28)",
                                },
                            }}>
                            취소
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleSignup}
                            disabled={mutation.isPending}
                            sx={{
                                mt: 1,
                                py: 1.4,
                                borderRadius: 2.8,
                                fontWeight: 900,
                                letterSpacing: -0.2,
                                boxShadow: "0 12px 28px rgba(37,99,235,0.22)",
                                "&:hover": {
                                    boxShadow:
                                        "0 14px 30px rgba(37,99,235,0.28)",
                                },
                            }}>
                            {mutation.isPending ? "가입 중..." : "가입하기"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default OAuth2SignupPage;
