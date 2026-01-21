import React, { useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/system";
import { usePrincipalState } from "../../store/usePrincipalState";
import { deleteCourse, getCourseListByUserId } from "../../apis/course/courseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Divider, Typography } from "@mui/material";
import CourseDetail from "./CourseDetail";
import CourseAdd from "./CourseAdd";

function CourseListPage() {
    const [isAdd, setIsAdd] = useState(false);
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
        onError: () => setCourseList([]),
    });

    const handleDelete = (course) => {
        deleteMutation.mutate(course.courseId);
    };

    const handleAdd = () => {
        setIsAdd(true);
    };

    useEffect(() => {
        setCourseList(response?.data);
    }, [response, isLoading]);

    if (isLoading) return <div>로딩중...</div>;

    return (
        <Container>
            <Stack display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    코스 리스트 관리
                </Typography>
                <Button variant="contained" onClick={handleAdd}>추가</Button>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {isAdd && (
                <Box>
                    <CourseAdd userId={principal?.userId} isAdd={() => setIsAdd(false)} />
                </Box>
            )}

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
