import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect } from "react";
import { Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

function DetailRow({ courseName, value, valueColor }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.8,
            }}>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {courseName}
            </Typography>

            <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: valueColor ?? "text.primary" }}>
                {valueColor ? value/1000 + "km" : value}
            </Typography>
        </Box>
    );
}

function CourseDetail({ course }) {
    const { kakaoObj, mapRef, map, setPoints } = useCourseMap({
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
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                overflow: "hidden", // 카드 안에서 지도/영역 깔끔하게 자르기
                bgcolor: "#F3F8FF",
                border: "1px solid",
                borderColor: "divider",
                width: "100%",
                maxWidth: 520,
                mx: "auto",
            }}>
            {/* 지도 영역 */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 220, sm: 280 }, // 높이 필수
                    bgcolor: "grey.200",
                }}>
                {/* 여기 ref에 카카오맵이 렌더됨 */}
                <Box
                    ref={mapRef}
                    sx={{
                        position: "absolute",
                        inset: 0,
                    }}
                />
            </Box>

            {/* 코스 정보 영역 */}
            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack spacing={1.2}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            lineHeight: 1.2,
                            wordBreak: "keep-all",
                        }}>
                        {course.courseName ? course.courseName : "-"}
                    </Typography>

                    <Divider />

                    <DetailRow
                        label="거리"
                        value={course.distanceM}
                        valueColor="primary.main"
                    />
                    <DetailRow label="지역" value={course.region} />
                </Stack>
            </Box>
        </Paper>
    );
}

export default CourseDetail;
