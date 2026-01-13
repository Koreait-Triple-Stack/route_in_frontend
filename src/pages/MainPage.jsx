import React from 'react';
import { Container, Typography, Box, Paper, Stack, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleItem from '../../components/ScheduleItem/ScheduleItem';

const MainPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* 상단 환영 배너 */}
      <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white', mb: 3 }}>
        <Typography variant="h5">안녕하세요, 테스트유저님!</Typography>
        <Typography variant="body1">오늘도 함께 운동해요 💪</Typography>
      </Paper>

      {/* 이번 주 스케줄 섹션 */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: 'primary.main', width: 557 }}>
          <CalendarMonthIcon />
          <Typography variant="subtitle1">이번 주 스케줄</Typography>
        </Stack>
        
        {/* 요일별 리스트 (데이터 맵핑으로 처리 권장) */}
        <Stack spacing={1.5}>
          <ScheduleItem day="월요일" tags={['벤치프레스', '스쿼트']} active />
          <ScheduleItem day="화요일" />
          <ScheduleItem day="수요일" />
          <ScheduleItem day="목요일" />
          <ScheduleItem day="금요일" />
          <ScheduleItem day="토요일" />
          <ScheduleItem day="일요일" />
        </Stack>
      </Box>

      {/* 내 러닝 코스 섹션 */}
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>내 러닝 코스</Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ width: '100%', height: 180, bgcolor: '#e9ecef', mb: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            지도 미리보기 영역
          </Box>
          <Typography variant="body2">출발: 강남역 | 도착: 선릉역</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>거리: 3.5km</Typography>
          <Button fullWidth variant="outlined">코스 관리하기</Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default MainPage;
