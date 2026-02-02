import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect, useState } from "react";
import { Button, Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CourseEdit from "./CourseEdit";

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

function CourseDetail({ course, setCourse }) {
    const [isEditing, setIsEditing] = useState(false);
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
                maxWidth: { xs: "100%" },
                mx: { xs: 0, sm: "auto" },
            }}>
            {/* 지도 영역 */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "clamp(220px, 35vh, 280px)", // 높이 필수
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
            <Box>
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
                            {course?.courseName ?? "-"}
                        </Typography>

                        <Divider />
                    </Stack>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Stack spacing={1.2}>
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
                                <DetailRow
                                    label="지역"
                                    value={course?.region ?? "-"}
                                />
                            </Box>
                        </Stack>
                        <Button onClick={() => setIsEditing(true)}>수정</Button>
                    </Box>
                </Box>
            </Box>
            {isEditing && (
                <Box>
                    <CourseEdit
                        course={course}
                        setCourse={setCourse}
                        isEditing={() => setIsEditing(false)}
                    />
                </Box>
            )}
        </Paper>
    );
}

export default CourseDetail;
