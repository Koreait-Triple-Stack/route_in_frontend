import React from "react";
import { Container, Typography, Box, Paper, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RoutineList from "./RoutineList";
import { usePrincipalState } from "../../store/usePrincipalState";
import FavoriteCourse from "./FavoriteCourse";

const MainPage = () => {
    const { principal } = usePrincipalState();
    
    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Paper sx={{ p: 3, bgcolor: "primary.main", color: "white", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                    안녕하세요, {principal?.username}님!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    오늘도 힘내서 득근하세요! 💪
                </Typography>
            </Paper>

            <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: "primary.main", pb: 1, borderBottom: "2px solid #eee" }}>
                    <CalendarMonthIcon />
                    <Typography variant="subtitle1" fontWeight="bold">
                        이번 주 스케줄
                    </Typography>
                </Stack>
                <Stack>
                    <RoutineList userId={principal?.userId} />
                </Stack>
                <Stack sx={{py: 2}}>
                    <FavoriteCourse userId={principal?.userId} />
                </Stack>
            </Box>
        </Container>
    );
};

export default MainPage;
