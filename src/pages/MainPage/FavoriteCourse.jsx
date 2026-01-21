import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getCourseFavoriteByUserId } from "../../apis/course/courseService";
import { Paper } from "@mui/material";
import { Stack } from "@mui/system";
import CourseDetail from "./CourseDetail";

function FavoriteCourse({ userId }) {
    const { data: response, isLoading } = useQuery({
        queryKey: ["getCourseFavoriteByUserId", userId],
        queryFn: () => getCourseFavoriteByUserId(userId),
        staleTime: 30000,
        enabled: !!userId,
    });

    const respData = response?.data || [];

    if (isLoading) return <div>로딩중...</div>;

    return (
        <Paper>
            <Stack spacing={2}>
                <CourseDetail key={respData.courseId} course={respData} />
            </Stack>
        </Paper>
    );
}

export default FavoriteCourse;
