import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Stack, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ScheduleItem from '../../components/ScheduleItem';
import { usePrincipalState } from '../../store/usePrincipalState';
import { getRoutineByUserIdRequest } from '../../apis/routine/routineApi';

const MainPage = () => {
  const { principal } = usePrincipalState()
  const { data, isLoading } = useQuery({
      queryKey: ["getRoutineByUserId"],
      queryFn: () => getRoutineByUserIdRequest(principal?.userId),
      enabled: !!principal,
      refetch: 1,
  });

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white', mb: 3 }}>
        <Typography variant="h5">안녕하세요, {principal?.username}님!</Typography>
        <Typography variant="body1">오늘도 함께 운동해요 💪</Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: 'primary.main', width: 557 }}>
          <CalendarMonthIcon />
          <Typography variant="subtitle1">이번 주 스케줄</Typography>
        </Stack>
        
        <Stack spacing={1.5}>
          <ScheduleItem day="월요일" activities={['러닝 5km', '저녁 산책 30분']} />
          <ScheduleItem day="화요일" activity="휴식" />
          <ScheduleItem day="수요일" activity="가슴" />
          <ScheduleItem day="목요일" activity="휴식" />
          <ScheduleItem day="금요일" activity="하체" />
          <ScheduleItem day="토요일" activity="팔" />
          <ScheduleItem day="일요일" activity="휴식" />
        </Stack>
      </Box>

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
