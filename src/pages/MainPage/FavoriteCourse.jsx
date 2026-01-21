import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getCourseFavoriteByUserId } from "../../apis/course/courseService";
import { Button, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import CourseDetail from "./CourseDetail";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

function FavoriteCourse({ userId }) {
    const navigate = useNavigate();
    const { data: response, isLoading } = useQuery({
        queryKey: ["getCourseFavoriteByUserId", userId],
        queryFn: () => getCourseFavoriteByUserId(userId),
        staleTime: 30000,
        enabled: !!userId,
    });

    const respData = response?.data || [];

    if (isLoading) return <Loading />;
    if (!response?.data)
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textAlign: "center",
                }}>
                <Stack spacing={0.5}>
                    <Typography sx={{ fontWeight: 800 }}>
                        즐겨찾기한 러닝 코스가 없어요
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mt: 0.5 }}>
                        러닝 코스를 즐겨찾기하면 여기에 표시됩니다.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate("/mypage/course")}>내 러닝 코스 관리로 이동</Button>
                </Stack>
            </Paper>
        );

    return (
        <Paper>
            <Stack spacing={2}>
                <CourseDetail key={respData.courseId} course={respData} />
            </Stack>
        </Paper>
    );
}

export default FavoriteCourse;
