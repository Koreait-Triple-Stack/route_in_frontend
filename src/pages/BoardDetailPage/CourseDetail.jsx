import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect, useState } from "react";
import { Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getCourseByBoardId } from "../../apis/course/courseService";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";

function DetailRow({ label, value, valueColor }) {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.8,
            }}>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {label}
            </Typography>

            <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: valueColor ?? "text.primary" }}>
                {valueColor ? value / 1000 + "km" : value}
            </Typography>
        </Box>
    );
}

function CourseDetail({ boardId }) {
    const boardIdNum = Number(boardId);
    const { mapRef, map, kakaoObj, setPoints } = useCourseMap({
        enableClickAdd: false,
    });

    const {
        data: courseResp,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getCourseByBoardId", boardId],
        queryFn: () => getCourseByBoardId(boardId),
        enabled: boardId > 0,
    });
    const [course, setCourse] = useState(null);

    useEffect(() => {
        if (courseResp) {
            setCourse(courseResp?.data);
        }
    }, [courseResp, isLoading]);

    useEffect(() => {
        if (!kakaoObj || !map || !course) return;

        const { centerLat, centerLng } = course;

        if (typeof centerLat === "number" && typeof centerLng === "number") {
            const center = new kakaoObj.maps.LatLng(centerLat, centerLng);
            map.panTo(center);
        }
    }, [kakaoObj, map, course]);

    useEffect(() => {
        if (!map || !kakaoObj) return;

        const onResize = () => {
            kakaoObj.maps.event.trigger(map, "resize");
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [map, kakaoObj]);

    useEffect(() => {
        setPoints(
            course?.points?.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            })),
        );
    }, [course]);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent />;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 0,
                overflow: "hidden",
                bgcolor: "#F3F8FF",
                borderColor: "divider",
                width: "100%",
                mx: { xs: 0, sm: "auto" },
            }}>
            {/* 지도 영역 */}
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
                {/* 코스 정보 영역 */}
                <Box sx={{ p: { xs: 2, sm: 2 } }}>
                    <Stack spacing={1.2}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                lineHeight: 1.2,
                                wordBreak: "keep-all",
                            }}>
                            {course?.courseName ?? "-"}
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
                            value={course?.distanceM ?? 0}
                            valueColor="primary.main"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <DetailRow label="지역" value={course?.region ?? "-"} />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}

export default CourseDetail;
