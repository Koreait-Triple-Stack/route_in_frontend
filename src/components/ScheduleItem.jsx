import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Stack, Chip, Button } from '@mui/material';
import { display, flex } from '@mui/system';
import { usePrincipalState } from '../store/usePrincipalState';

const ScheduleItem = ({ day, activities, active }) => {
  const { principal } = usePrincipalState()
  const [activitiesValue, setActivitiesValue] = useState([])
  const handleReset = () => {
    if (confirm("운동 목록을 초기화하시겠습니까?")) {
      activitiesValue([]); 
    }
  };
  
  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: active ? '#f0f7ff' : 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80 }} >
        <Box width={50}>
          <Typography variant="body2" fontWeight="bold" >{day}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'start', width: 440, alignItems: 'center' }} > 
          {activities?.map((act, index) => (
            <Typography key={index} variant="caption" color="primary" sx={{ fontWeight: 'bold', margin: 1 }} >
              {act}
            </Typography>
            ))
          }
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Button>수정</Button>
          <Button onClick={handleReset}>초기화</Button>
        </Box>
      </Box>
    </Paper>
  )
};

export default ScheduleItem;
