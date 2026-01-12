import React from 'react';
import { Typography, Box, Paper, Stack, Chip } from '@mui/material';

const ScheduleItem = ({ day, activity, tags, active }) => (
  <Paper variant="outlined" sx={{ p: 2, bgcolor: active ? '#f0f7ff' : 'white' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: tags ? 1 : 0 }}>
      <Typography variant="body2" fontWeight="bold">{day}</Typography>
      <Typography variant="caption" color="primary">{activity}</Typography>
    </Box>
    {tags && (
      <Stack direction="row" spacing={1}>
        {tags.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
      </Stack>
    )}
  </Paper>
);

export default ScheduleItem;
