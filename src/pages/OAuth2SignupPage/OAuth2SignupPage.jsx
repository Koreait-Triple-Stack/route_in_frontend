import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, Paper, Typography, Box, TextField, Button, 
  MenuItem, Select, FormControl, FormHelperText, InputAdornment, Stack 
} from '@mui/material';
import { useDaumPostcodePopup } from 'react-daum-postcode'; // 라이브러리 import
import { oAuth2SignupRequest } from '../../apis/oAuth2/oAuth2Api';

const OAuth2SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 주소 검색 팝업 훅 설정
  const open = useDaumPostcodePopup();

  const [formData, setFormData] = useState({
    nickname: '',
    birthDate: '',
    gender: '',
    // 주소 관련 상태 3개로 분리
    zipCode: '',       // 우편번호
    addressBasic: '',  // 기본주소 (자동입력)
    addressDetail: '', // 상세주소 (직접입력)
    height: '',
    weight: ''
  });

  const [errors, setErrors] = useState({});

  // 2. 주소 검색 완료 핸들러
  const handleAddressComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    // 상태 업데이트 (우편번호, 기본주소)
    setFormData(prev => ({
      ...prev,
      zipCode: data.zonecode,
      addressBasic: fullAddress,
      addressDetail: '' // 주소가 바뀌면 상세주소 초기화 (선택사항)
    }));
    
    // 주소 에러 초기화
    if(errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  };

  // 주소 검색 버튼 클릭 시 실행
  const handleAddressSearch = () => {
    open({ onComplete: handleAddressComplete });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'birthDate') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignup = () => {
    const newErrors = {};
    
    if (!formData.nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';
    if (formData.birthDate.length !== 8) newErrors.birthDate = '생년월일 8자리를 입력해주세요.';
    if (!formData.gender) newErrors.gender = '성별을 선택해주세요.';
    
    // [수정] 주소 유효성 검사 (우편번호나 상세주소 체크)
    if (!formData.zipCode || !formData.addressBasic) {
      newErrors.address = '주소를 검색해주세요.';
    } else if (!formData.addressDetail.trim()) {
      newErrors.address = '상세주소를 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!confirm("회원가입하시겠습니까?")) return;

    const formattedBirthDate = 
      `${formData.birthDate.slice(0, 4)}-${formData.birthDate.slice(4, 6)}-${formData.birthDate.slice(6, 8)}`;

    // [수정] 백엔드로 보낼 때 주소 합치기 (예: "12345 서울시 강남구 ... 101호")
    // 필요에 따라 zipCode를 별도로 보낼 수도 있습니다.
    const fullAddressString = `(${formData.zipCode}) ${formData.addressBasic} ${formData.addressDetail}`;

    oAuth2SignupRequest({
      nickname: formData.nickname,
      birthDate: formattedBirthDate,
      gender: formData.gender,
      address: fullAddressString, // 합쳐진 주소 문자열
      height: Number(formData.height),
      weight: Number(formData.weight),
      provider: location.state?.provider,
      providerUserId: location.state?.providerUserId,
      email: location.state?.email 
    })
    .then((response) => {
        if (response.data.status === "success") {
            alert("회원가입이 완료되었습니다.");
            navigate("/oauth2/signin");
        }
    })
    .catch((error) => {
        console.error(error);
        alert("회원가입 중 오류가 발생했습니다.");
    });
  };

  const Label = ({ children, required }) => (
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
      {children} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </Typography>
  );

  return (
    <Container maxWidth="xs" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #eee' }}>
        <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 700 }}>
          회원가입
        </Typography>

        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Box>
            <Label required>닉네임</Label>
            <TextField
              fullWidth name="nickname" placeholder="닉네임을 입력해주세요"
              value={formData.nickname} onChange={handleInputChange}
              error={!!errors.nickname} helperText={errors.nickname}
              variant="outlined" size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <Label required>생년월일</Label>
            <TextField
              fullWidth name="birthDate" placeholder="예) 19990101"
              value={formData.birthDate} onChange={handleInputChange}
              error={!!errors.birthDate} helperText={errors.birthDate}
              variant="outlined" size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              inputProps={{ inputMode: 'numeric', maxLength: 8 }} 
            />
          </Box>

          <Box>
            <Label required>성별</Label>
            <FormControl fullWidth size="small" error={!!errors.gender}>
              <Select
                name="gender" value={formData.gender} onChange={handleInputChange}
                displayEmpty sx={{ borderRadius: 2 }}
              >
                <MenuItem value="" disabled><Typography color="text.secondary">선택해주세요</Typography></MenuItem>
                <MenuItem value="M">남성</MenuItem>
                <MenuItem value="F">여성</MenuItem>
              </Select>
              {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
            </FormControl>
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
                  size="small"
                  fullWidth
                  // 사용자가 직접 수정 못하게 readOnly 설정
                  InputProps={{ readOnly: true, sx: { borderRadius: 2, bgcolor: '#f8f9fa' } }} 
                  error={!!errors.address}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddressSearch}
                  sx={{ borderRadius: 2, whiteSpace: 'nowrap', minWidth: '80px' }}
                >
                  주소 검색
                </Button>
              </Stack>

              {/* 기본 주소 */}
              <TextField
                fullWidth
                placeholder="기본 주소"
                value={formData.addressBasic}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true, sx: { borderRadius: 2, bgcolor: '#f8f9fa' } }}
                error={!!errors.address}
              />

              {/* 상세 주소 */}
              <TextField
                fullWidth
                name="addressDetail"
                placeholder="상세 주소를 입력해주세요 (예: 101동 101호)"
                value={formData.addressDetail}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                error={!!errors.address}
                helperText={errors.address} // 에러 메시지는 상세주소 밑에 표시
              />
            </Stack>
          </Box>

          <Box>
            <Label>키 (cm)</Label>
            <TextField
              fullWidth name="height" placeholder="예: 175"
              value={formData.height} onChange={handleInputChange}
              error={!!errors.height} helperText={errors.height}
              variant="outlined" size="small"
              InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment>, sx: { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <Label>몸무게 (kg)</Label>
            <TextField
              fullWidth name="weight" placeholder="예: 70"
              value={formData.weight} onChange={handleInputChange}
              error={!!errors.weight} helperText={errors.weight}
              variant="outlined" size="small"
              InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment>, sx: { borderRadius: 2 } }}
            />
          </Box>

          <Button
            fullWidth variant="contained" size="large" onClick={handleSignup}
            sx={{ 
              mt: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem',
              bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }
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