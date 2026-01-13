import React from 'react'

function RenderOverlayContent() {
    const handleCloseOverlay = () => setActiveView(null);
    const renderOverlayContent = () => {
        if (!activeView) return null;

        let title = "";
        let content = null;

        switch(activeView) {
            case "username": 
                title = "닉네임 변경"; 
                content = (
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            새로운 닉네임을 입력해주세요.
                        </Typography>
                        <TextField
                            fullWidth
                            label="새 닉네임"
                            variant="outlined"
                            value={usernameInputValue}
                            onChange={handleUsernameChange} 
                            placeholder="새 닉네임을 입력해주세요."
                            sx={{ mb: 3 }}
                        />
                        <Button 
                            variant="contained" fullWidth size="large"
                            onClick={changeUsernameOnClickHandler}
                            disabled={!usernameInputValue}
                        >
                            변경 완료
                        </Button>
                    </Box>
                );
                break;
            case "address": 
                title = "주소 변경"; 
                content = (
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            새로운 주소를 입력해주세요.
                        </Typography>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    placeholder="우편번호"
                                    value={addressInputValue.zipCode}
                                    variant="outlined"
                                    size="small"
                                    error={!!errors.address}
                                    fullWidth
                                    inputProps={{ readOnly: true }} 
                                />
                                <Button 
                                    variant="outlined" 
                                    onClick={handleAddressSearch}
                                    sx={{ borderRadius: 1, whiteSpace: 'nowrap', minWidth: '80px' }}
                                >
                                    주소 검색
                                </Button>
                            </Stack>
                            <TextField
                                fullWidth
                                placeholder="기본 주소"
                                value={addressInputValue.baseAddress} 
                                variant="outlined"
                                size="small"
                                error={!!errors.address}
                                inputProps={{ readOnly: true }}
                            />
                            <TextField
                                fullWidth
                                name="detailAddress"
                                placeholder="상세 주소를 입력해주세요 (예: 101동 101호)"
                                value={addressInputValue.detailAddress} 
                                onChange={handleAddressDetailChange} 
                                variant="outlined"
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                                error={!!errors.address}
                                helperText={errors.address} 
                            />
                        </Stack>
                        <Button 
                            variant="contained" fullWidth size="large"
                            onClick={changeAddressOnClickHandler}
                            disabled={!addressInputValue.zipCode || !addressInputValue.detailAddress}
                            sx={{ mt: 3 }}
                        >
                            변경 완료
                        </Button>
                    </Box>
                );
                break;                
            case "bodyInfo": 
                title = "키/몸무게 변경"; 
                content = (
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            새로운 신체정보를 입력해주세요.
                        </Typography>
                        <TextField
                            fullWidth
                            name="height"
                            label="키 (cm)"
                            variant="outlined"
                            value={bodyInfoInputValue.height}
                            onChange={handleBodyInfoChange} 
                            placeholder="키를 입력해주세요."
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            name="weight"
                            label="몸무게 (kg)" 
                            variant="outlined"
                            value={bodyInfoInputValue.weight}
                            onChange={handleBodyInfoChange} 
                            placeholder="몸무게를 입력해주세요."
                            sx={{ mb: 3 }}
                        />
                        <Button 
                            variant="contained" fullWidth size="large"
                            onClick={changeBodyInfoOnClickHandler}
                            disabled={!bodyInfoInputValue.height || !bodyInfoInputValue.weight}
                        >
                            변경 완료
                        </Button>
                    </Box>
                );
                break;
            case "withdraw": 
                title = "회원 탈퇴"; 
                content = <Typography>정말 탈퇴하시겠습니까?</Typography>; 
                break;
            default: return null;
        }

        return (
            <Box 
                sx={{
                    position: "absolute", 
                    top: 0, left: 0, 
                    width: "100%", height: "100%", 
                    bgcolor: "yellow",    
                    zIndex: 10, padding: 2, 
                    boxSizing: 'border-box',
                    display: "flex", flexDirection: "column"
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
                    <IconButton onClick={handleCloseOverlay} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">{title}</Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    {content}
                </Box>
            </Box>
        );
    }
}

export default RenderOverlayContent