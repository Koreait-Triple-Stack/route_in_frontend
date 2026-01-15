import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Container, Paper, Typography, Button, Stack, 
  AppBar, Toolbar, IconButton, CircularProgress 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// [변경] Zustand 스토어 import (파일 경로를 실제 위치로 맞춰주세요)
// 예: src/stores/PrincipalStore.js

import { oAuth2SigninRequest } from '../../apis/oAuth2/oAuth2Api'; 
import { usePrincipalState } from '../../store/usePrincipalState';

const OAuth2SigninPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // [변경] Zustand에서 상태 가져오기 (login 함수는 사실 리다이렉트 할 거라 안 써도 되지만 일단 가져옴)
  const { login } = usePrincipalState();
  
  // 로딩 상태
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');
    const provider = searchParams.get('provider');
    const providerUserId = searchParams.get('providerUserId');

    // Case 1: URL에 이미 토큰이 있는 경우 (백엔드에서 바로 토큰을 준 경우)
    if (accessToken) {
      // 1. 로컬 스토리지에 토큰 저장 (필수!)
      localStorage.setItem("AccessToken", accessToken);
      
      // 2. 상태 업데이트 (선택 사항, 리다이렉트 시 어차피 새로고침 됨)
      // login({ token: accessToken }); 

      // 3. 메인으로 이동 (새로고침 효과를 위해 window.location 사용)
      window.location.href = '/'; 
      return;
    }

    // Case 2: URL에 provider 정보가 있는 경우 (회원 여부 확인 필요)
    if (provider && providerUserId) {
      setIsProcessing(true);

      oAuth2SigninRequest({
        provider: provider,
        providerUserId: providerUserId
      })
      .then((response) => {
          if (response.status === "success") {
              // [로그인 성공]
              const token = response;
              
              // 1. 토큰 저장
              localStorage.setItem("AccessToken", token);
              
              // 2. 메인으로 이동
              window.location.href = "/";

          } else if (response.status === "failed") {
              // [미가입 회원] -> 회원가입 페이지로 이동
              if (confirm("가입되지 않은 회원입니다. 회원가입 페이지로 이동하시겠습니까?")) {
                  navigate('/oauth2/signup', {
                      state: {
                          provider: provider,
                          providerUserId: providerUserId
                      }
                  });
              } else {
                  navigate('/auth/signin', { replace: true });
                  setIsProcessing(false);
              }
          }
      })
      .catch((error) => {
          console.error(error);
          alert("로그인 처리 중 문제가 발생했습니다.");
          setIsProcessing(false);
      });
    }
  }, [location, navigate, login]);

  // 소셜 로그인 버튼 핸들러
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
  };

  if (isProcessing) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>로그인 정보를 확인 중입니다...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', width:557 }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Route In
          </Typography>
          <Button color="inherit" sx={{ fontWeight: 'bold', color: '#2563eb' }}>
            로그인
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xs" sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, width: '100%', borderRadius: 4, 
            border: '1px solid #eee', bgcolor: 'white',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 500 }}>
            로그인
          </Typography>

          <Stack spacing={2}>
            <Button
              fullWidth variant="outlined" onClick={handleGoogleLogin}
              startIcon={<Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />}
              sx={{
                py: 1.5, borderColor: '#e0e0e0', color: 'text.primary', bgcolor: 'white', borderRadius: 2,
                '&:hover': { bgcolor: '#f5f5f5', borderColor: '#d0d0d0' }
              }}
            >
              구글로 로그인
            </Button>

            <Button
              fullWidth variant="contained" onClick={handleNaverLogin}
              startIcon={<Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'white' }} />}
              sx={{
                py: 1.5, bgcolor: '#03c75a', color: 'white', borderRadius: 2, boxShadow: 'none',
                '&:hover': { bgcolor: '#02b350', boxShadow: 'none' }
              }}
            >
              네이버로 로그인
            </Button>
          </Stack>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">계정이 없으신가요? </Typography>
            <Typography 
              variant="body2" component="span" 
              sx={{ color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={() => navigate("/oauth2/signup")}
            >
              회원가입
            </Typography>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
};

export default OAuth2SigninPage;