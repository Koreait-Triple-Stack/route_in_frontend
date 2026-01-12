import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Container, Paper, Typography, Button, Stack, 
  AppBar, Toolbar, IconButton 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import { usePrincipalState } from '../../store/usePrincipalState';

const OAuth2SigninPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = usePrincipalState(); // 로그인 함수 사용

  // ★ 추가된 부분: 화면이 로드될 때 URL에 토큰이 있는지 검사
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');

    // 1. URL에 토큰이 있다면? (로그인 성공 후 리다이렉트 된 상황)
    if (accessToken) {
      login(accessToken); // Context에 토큰 저장 및 로그인 상태 변경
      window.location.href = '/'; // 메인 페이지로 이동 (새로고침 효과)
    }
    
    // 2. 토큰이 없다면? (그냥 사용자가 로그인하러 들어온 상황)
    // -> 아무것도 안 하고 아래의 버튼 화면을 보여줌
  }, [location, login]);

  // 소셜 로그인 핸들러
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      
      {/* 헤더 부분 */}
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

      {/* 로그인 카드 영역 */}
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
            {/* 구글 버튼 */}
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

            {/* 네이버 버튼 */}
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