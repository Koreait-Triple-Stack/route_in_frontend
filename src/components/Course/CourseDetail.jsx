import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect } from "react";
import { getCourse } from "../../apis/course/courseService";
import { Alert, Button, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useParams } from "react-router-dom";

function CourseDetail({ course }) {
    const { mapRef, setPoints, points, distanceM } = useCourseMap();

    useEffect(() => {
        setPoints(
            result.data.points.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            }))
        );
    }, [course]);

    return (
        <Box sx={{ width: "100vw", height: "100vh", position: "relative" }}>
            {/* Map */}
            <Box ref={mapRef} sx={{ width: "100%", height: "100%" }} />

            {/* Overlay Panel */}
            <Paper
                elevation={6}
                sx={{
                    position: "absolute",
                    left: 12,
                    top: 12,
                    width: { xs: "calc(100% - 24px)", sm: 360 },
                    p: 2,
                    borderRadius: 3,
                }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    코스 조회
                </Typography>

                <Stack spacing={1}>
                    <Typography variant="body2">
                        코스명: <b>{course.courseName}</b>
                    </Typography>
                    <Typography variant="body2">
                        포인트: <b>{points.length}</b>개
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1, flexWrap: "wrap" }}>
                        <Button
                            component={RouterLink}
                            to={`/course/edit/${course.courseId}`}
                            variant="contained">
                            수정하러 가기
                        </Button>
                    </Stack>

                    {error && <Alert severity="error">{error}</Alert>}
                </Stack>
            </Paper>
        </Box>
    );
}

export default CourseDetail;
