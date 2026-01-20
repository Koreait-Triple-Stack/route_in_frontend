import React, { useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/system";
import { usePrincipalState } from "../../store/usePrincipalState";
import { deleteCourse, getCourseListByUserId } from "../../apis/course/courseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Divider, Typography } from "@mui/material";
import CourseDetail from "../../components/Course/CourseDetail";

function CourseListPage() {
    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();

    const { data: response, isLoading } = useQuery({
        queryKey: ["getCourseListByUserId", principal?.userId],
        queryFn: () => getCourseListByUserId(principal?.userId),
        staleTime: 30000,
        enabled: !!principal?.userId,
    });

    const [courseList, setCourseList] = useState([]);

    const deleteMutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => queryClient.invalidateQueries(["getCourseListByUserId", principal?.userId]),
        onError: () => setCourseList([])
    });

    const handleDelete = (course) => {
        deleteMutation.mutate(course.courseId);
    };

    useEffect(() => {
        setCourseList(response?.data);
    }, [response, isLoading])

    if (isLoading) return <div>로딩중...</div>;

    return (
        <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 500 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    코스 리스트 관리
                </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
                {courseList?.length > 0 ? (
                    courseList?.map((course) => <CourseDetail key={course.courseId} course={course} onDelete={handleDelete} />)
                ) : (
                    <Box sx={{ py: 10, textAlign: "center" }}>
                        <Typography color="text.secondary">코스 리스트가 없습니다.</Typography>
                    </Box>
                )}
            </Stack>
        </Container>
    );
}

export default CourseListPage;
