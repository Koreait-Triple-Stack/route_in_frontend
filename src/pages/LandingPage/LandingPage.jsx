import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Stack 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'white' }}>
      {/* 1. 상단 헤더 */}
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #f0f0f0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          {/* 로고: Route In으로 변경 가능 */}
          <Typography variant="h6" sx={{ color: '#2563eb', fontWeight: 'bold', letterSpacing: -0.5 }}>
            Route In
          </Typography>
          <Button color="inherit" sx={{ fontSize: '0.9rem' }} onClick={() => navigate("/oauth2/signin")}>
            로그인
          </Button>
        </Toolbar>
      </AppBar>

      {/* 2. 중앙 컨텐츠 영역 */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          px: 4,
          pb: 10 // 하단 여백을 주어 시각적 안정감 부여
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 800, 
            mb: 2, 
            wordBreak: 'keep-all', // 한글 단어 단위 줄바꿈
            lineHeight: 1.3 
          }}
        >
          FitShare에 오신 것을 환영합니다
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            mb: 6, 
            wordBreak: 'keep-all' 
          }}
        >
          러닝 코스와 운동 루틴을 공유하고 추천받으세요
        </Typography>

        {/* 3. 버튼 그룹 */}
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '320px' }}>
          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            sx={{ 
              py: 1.8, 
              borderRadius: '12px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' }
            }}
            onClick={() => navigate("/oauth2/signin")}
          >
            로그인
          </Button>
          
          <Button 
            fullWidth 
            variant="outlined" 
            size="large"
            sx={{ 
              py: 1.8, 
              borderRadius: '12px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              borderWidth: '1.5px',
              '&:hover': { borderWidth: '1.5px' }
            }}
            onClick={() => navigate("/oauth2/signup")}
          >
            회원가입
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingPage;