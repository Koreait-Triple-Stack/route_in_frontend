import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect } from "react";
import { Alert, Button, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

function CourseDetail({ course }) {
    const { kakaoObj, mapRef, map, setPoints, points, distanceM } = useCourseMap({
        enableClickAdd: false,
    });

    useEffect(() => {
        if (!kakaoObj || !map || !course) return;

        const { centerLat, centerLng } = course;

        if (typeof centerLat === "number" && typeof centerLng === "number") {
            const center = new kakaoObj.maps.LatLng(centerLat, centerLng);
            map.panTo(center);
        }
    }, [kakaoObj, map, course]);

    useEffect(() => {
        setPoints(
            course.points.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            }))
        );
    }, [course]);

    if (!course) {
        return (
            <Box
                sx={{
                    width: "100vw",
                    height: "100vh",
                    display: "grid",
                    placeItems: "center",
                }}>
                로딩중...
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100vw", height: "100vh", position: "relative" }}>
            {/* Map */}
            <Box ref={mapRef} sx={{ width: "100%", height: "100%", zIndex: 0 }} />

            {/* Overlay Panel */}
            <Paper
                elevation={6}
                sx={{
                    position: "absolute",
                    left: 12,
                    top: 12,
                    width: { xs: "calc(100% - 24px)", sm: 360 },
                    borderRadius: 3,
                    overflow: "hidden",
                    zIndex: 10
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
                            // component={RouterLink}
                            to={`/course/edit/${course.courseId}`}
                            variant="contained">
                            수정하러 가기
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}

export default CourseDetail;
