import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect, useState } from "react";
import { Button, Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Loading from "../../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { usePrincipalState } from "../../store/usePrincipalState";
import { getCourseFavoriteByUserId } from "../../apis/course/courseService";
import ErrorComponent from "../../components/ErrorComponent";
import { useNavigate } from "react-router-dom";

function DetailRow({ label, value, valueColor }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                py: 0.8,
            }}>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {label}
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontWeight: 600,
                    color: valueColor ?? "text.primary",
                    px: 5,
                }}>
                {valueColor ? value / 1000 + "km" : value}
            </Typography>
        </Box>
    );
}

function CourseDetail() {
    const { principal } = usePrincipalState();
    const { mapRef, map, kakaoObj, setPoints } = useCourseMap({
        enableClickAdd: false,
    });
    const navigate = useNavigate();

    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getCourseFavoriteByUserId", principal?.userId],
        queryFn: () => getCourseFavoriteByUserId(principal?.userId),
        staleTime: 30000,
    });
    const [course, setCourse] = useState(null);

    useEffect(() => {
        if (!isLoading) {
            setCourse(response.data);
        }
    }, [response, isLoading]);

    useEffect(() => {
        if (!kakaoObj || !map || !course) return;

        const { centerLat, centerLng } = course;

        if (typeof centerLat === "number" && typeof centerLng === "number") {
            const center = new kakaoObj.maps.LatLng(centerLat, centerLng);
            map.panTo(center);
        }
    }, [kakaoObj, map, course]);

    useEffect(() => {
        if (!course?.points) return;
        if (course) {
            setPoints(
                course?.points?.map((point) => ({
                    lat: Number(point.lat),
                    lng: Number(point.lng),
                })),
            );
        }
    }, [course, setPoints]);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    if (!course)
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
                    <Button
                        variant="contained"
                        onClick={() => navigate("/mypage/course")}>
                        내 러닝 코스 관리로 이동
                    </Button>
                </Stack>
            </Paper>
        );

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#F3F8FF",
                border: "1px solid",
                borderColor: "divider",
                width: "100%",
                mx: { xs: 0, sm: "auto" },
            }}
            key={course.courseId}>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "clamp(220px, 35vh, 280px)",
                    bgcolor: "grey.200",
                }}>
                <Box
                    ref={mapRef}
                    sx={{
                        position: "absolute",
                        inset: 0,
                    }}
                />
            </Box>
            <Box>
                <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack spacing={1.2}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                lineHeight: 1.2,
                                wordBreak: "keep-all",
                            }}>
                            {course.courseName}
                        </Typography>

                        <Divider />
                    </Stack>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <DetailRow
                            label="거리"
                            value={course.distanceM}
                            valueColor="primary.main"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <DetailRow label="지역" value={course.region} />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}

export default CourseDetail;
