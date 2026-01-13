import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import { changeAddressRequest, changeBodyInfoRequest, changeUsernameRequest } from "../../apis/account/accountApi";
import { useDaumPostcodePopup } from 'react-daum-postcode';

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { Box, Container, height, Stack } from "@mui/system";
import { Button, IconButton, TextField, Typography, Collapse } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import DraftsIcon from "@mui/icons-material/Drafts";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from '@mui/icons-material/Logout'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function MyPage() {
    const navigate = useNavigate();
    const { isLoggedIn, logout, principal, loading } = usePrincipalState();
    
    const [activeView, setActiveView] = useState(null);
    const [open, setOpen] = useState(false);

    const [usernameInputValue, setUsernameInputValue] = useState("");
    const [addressInputValue, setAddressInputValue] = useState({
        zipCode: "",
        baseAddress: "",  
        detailAddress: ""  
    });
    const [bodyInfoInputValue, setBodyInfoInputValue] = useState({
        height: "",
        weight: ""
    });

    const [errors, setErrors] = useState({
        address: ""
    });

    const handleUsernameChange = (e) => {
        setUsernameInputValue(e.target.value);
    };

    const handleAddressDetailChange = (e) => {
        const { value } = e.target;
        setAddressInputValue(prev => ({
            ...prev,
            detailAddress: value
        }));
    };

    const handleBodyInfoChange = (e) => {
        const { name, value } = e.target;
        if (!/^\d*\.?\d*$/.test(value)) return; 

        setBodyInfoInputValue(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const changeUsernameOnClickHandler = () => {
        if (!confirm("username을 변경하시겠습니까?")) return;

        changeUsernameRequest({
            userId: principal?.userId,
            username: usernameInputValue,
        })
        .then((response) => {
            if (response.data.status === "success") {
                alert(response.data.message);
                setActiveView(null); 
            } else {
                alert(response.data.message);
            }
        })
        .catch(() => {
            alert("문제가 발생했습니다. 다시 시도해주세요.");
        });
    };

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

        setErrors(prev => ({ ...prev, address: '' }));
    };

    const openPostcode = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');
    const handleAddressSearch = () => {
        openPostcode({ onComplete: handleAddressComplete });
    };

    const changeAddressOnClickHandler = () => {
        if(!addressInputValue.zipCode || !addressInputValue.detailAddress) {
             setErrors({ address: "주소와 상세주소를 모두 입력해주세요." });
             return;
        }

        if (!confirm("주소를 변경하시겠습니까?")) return;

        changeAddressRequest({
            userId: principal?.userId,
            zipCode: addressInputValue.zipCode,
            baseAddress: addressInputValue.baseAddress,
            detailAddress: addressInputValue.detailAddress
        })
        .then((response) => {
            if (response.data.status === "success") {
                alert(response.data.message);
                setActiveView(null);
            } else {
                alert(response.data.message);
            }
        })
        .catch(() => {
            alert("문제가 발생했습니다. 다시 시도해주세요.");
        });
    };

    const changeBodyInfoOnClickHandler = () => {
        if(!bodyInfoInputValue.height || !bodyInfoInputValue.weight) {
             alert("모든 항목을 입력해주세요.");
             return;
        }
        
        if (!confirm("신체정보를 변경하시겠습니까?")) return;

        changeBodyInfoRequest({
            userId: principal?.userId,
            height: bodyInfoInputValue.height,
            weight: bodyInfoInputValue.weight
        })
        .then((response) => {
            if (response.data.status === "success") {
                alert(response.data.message);
                setActiveView(null);
            } else {
                alert(response.data.message);
            }
        })
        .catch(() => {
            alert("문제가 발생했습니다. 다시 시도해주세요.");
        });
    }

    const handleClick = () => setOpen(!open);
    
    const handleMenuClick = (view) => {
        setActiveView(view);
        if(view === "username") setUsernameInputValue("");
        if(view === "address") {
            setAddressInputValue({ zipCode: "", baseAddress: "", detailAddress: "" });
            setErrors({ address: "" });
        }
        if (view === "bodyInfo") {
            setBodyInfoInputValue({ height: "", weight: "" })
        }
    }

    const handleCloseOverlay = () => setActiveView(null);

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = "/oauth2/signin";
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn || loading) return <></>; 

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

    return (
        <Container sx={{ padding: "20px 0" }}> 
            <List
                sx={{
                    position: "relative",
                    width: "100%", maxWidth: 360, minWidth: 300,
                    bgcolor: "background.paper",
                    overflow: "hidden",
                    border: "1px solid #dbdbdb",
                    boxSizing: "border-box", borderRadius: "14px",
                    minHeight: "300px" 
                }}
                component="nav"
                aria-labelledby="profile"
                subheader={
                    <ListSubheader component="div" id="profile">
                        마이 프로필
                    </ListSubheader>
                }
            >
                {renderOverlayContent()}

                <Box sx={{
                    padding: "0 0 10px 16px",
                    display: "flex", justifyContent: "start", alignItems: "center", gap: "10px",
                }}>
                    <Box
                        component="img"
                        src="https://firebasestorage.googleapis.com/v0/b/board-study-26e00.firebasestorage.app/o/profile-img%2F40aaf171-5eae-4e81-96af-a89730616960_jpeg?alt=media&token=86b09376-18b3-49a9-881d-2b5ae5a728eb"
                        sx={{ width: 64, height: 64, objectFit: "cover", borderRadius: "50%" }}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h6">{principal?.username}</Typography>
                        <Typography variant="body2">
                            {principal?.gender} • {principal?.address?.baseAddress}
                        </Typography>
                        <Typography variant="caption">{principal?.height}cm / {principal?.weight}kg</Typography>
                    </Box>
                </Box>

                <ListItemButton>
                    <ListItemIcon><SendIcon /></ListItemIcon>
                    <ListItemText primary="인바디 기록 추가/삭제" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon><DraftsIcon /></ListItemIcon>
                    <ListItemText primary="나만의 코스 수정" />
                </ListItemButton>
                <ListItemButton onClick={handleClick} >
                    <ListItemIcon><InboxIcon /></ListItemIcon>
                    <ListItemText primary="개인정보 수정" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick("username")}>
                            <ListItemIcon><StarBorderIcon /></ListItemIcon>
                            <ListItemText primary="닉네임 변경" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick("address")}>
                            <ListItemIcon><StarBorderIcon /></ListItemIcon>
                            <ListItemText primary="주소 변경" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick("bodyInfo")}>
                            <ListItemIcon><StarBorderIcon /></ListItemIcon>
                            <ListItemText primary="키/몸무게 변경" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuClick("withdraw")}>
                            <ListItemIcon><StarBorderIcon /></ListItemIcon>
                            <ListItemText primary="회원 탈퇴" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton onClick={logout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="로그아웃" />
                </ListItemButton>
            </List>
        </Container>
    );
}

export default MyPage;