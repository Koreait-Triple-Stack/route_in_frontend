import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect } from "react";
import { Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Loading from "../../components/Loading";

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

function CourseDetail({ course }) {
    const { mapRef, map, kakaoObj, setPoints } = useCourseMap({
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
        if (!course?.points) return;
        setPoints(
            course?.points?.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            })),
        );
    }, [course]);

    if (!course) return <Loading />;

    return (
        <Paper
            elevation={0}
            sx={{
                my: 1,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#F3F8FF",
                borderColor: "divider",
                width: "100%",
                mx: { xs: 0, sm: "auto" },
            }}>
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
