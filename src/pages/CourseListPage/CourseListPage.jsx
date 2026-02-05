import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/system";
import { usePrincipalState } from "../../store/usePrincipalState";
import {
    changeCourseFavorite,
    deleteCourse,
    getCourseListByUserId,
} from "../../apis/course/courseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Divider, Typography } from "@mui/material";
import CourseDetail from "./CourseDetail";
import CourseAdd from "./CourseAdd";
import Loading from "../../components/Loading";
import AddIcon from "@mui/icons-material/Add";

function CourseListPage() {
    const [isAdd, setIsAdd] = useState(false);
    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();

    const { data: response, isLoading } = useQuery({
        queryKey: ["getCourseListByUserId", principal?.userId],
        queryFn: () => getCourseListByUserId(principal?.userId),
        staleTime: 30000,
        enabled: !!principal?.userId,
        placeholderData: (prev) => prev,
    });
    const courseList = response?.data ?? [];

    const deleteMutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () =>
            queryClient.invalidateQueries([
                "getCourseListByUserId",
                principal?.userId,
            ]),
    });

    const changeMutation = useMutation({
        mutationFn: changeCourseFavorite,

        onMutate: async ({ courseId }) => {
            await queryClient.cancelQueries({
                queryKey: ["getCourseListByUserId", principal?.userId],
            });
            const prev = queryClient.getQueryData([
                "getCourseListByUserId",
                principal?.userId,
            ]);

            queryClient.setQueryData(
                ["getCourseListByUserId", principal?.userId],
                (old) => {
                    if (!old?.data) return old;

                    const wasFav = old.data.find(
                        (c) => c.courseId === courseId,
                    )?.favorite;

                    return {
                        ...old,
                        data: old.data.map((c) => ({
                            ...c,
                            favorite: wasFav ? false : c.courseId === courseId,
                        })),
                    };
                },
            );

            return { prev };
        },

        onError: (_e, _v, ctx) =>
            ctx?.prev &&
            queryClient.setQueryData(
                ["getCourseListByUserId", principal?.userId],
                ctx.prev,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getCourseListByUserId", principal?.userId],
                refetchType: "inactive",
            });
            queryClient.invalidateQueries({
                queryKey: ["getCourseFavoriteByUserId", principal?.userId],
                refetchType: "inactive",
            });
        },
    });

    const handleDelete = (course) => {
        deleteMutation.mutate(course.courseId);
    };

    const handleChecked = (course) => {
        changeMutation.mutate({
            courseId: course?.courseId,
            userId: principal?.userId,
        });
    };

    const handleAdd = () => {
        setIsAdd(true);
    };

    if (isLoading) return <Loading />;

    return (
        <Container>
            <Box
                sx={{
                    my: 2,
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    코스 리스트 관리
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}>
                    추가
                </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {isAdd && (
                <Box>
                    <CourseAdd
                        userId={principal?.userId}
                        isAdd={() => setIsAdd(false)}
                    />
                </Box>
            )}

            <Stack spacing={2}>
                {courseList?.length > 0 ? (
                    courseList?.map((course) => (
                        <CourseDetail
                            key={course.courseId}
                            course={course}
                            onDelete={handleDelete}
                            onChecked={handleChecked}
                            checked={course.favorite}
                        />
                    ))
                ) : (
                    <Box sx={{ py: 10, textAlign: "center" }}>
                        <Typography color="text.secondary">
                            코스 리스트가 없습니다.
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Container>
    );
}

export default CourseListPage;
