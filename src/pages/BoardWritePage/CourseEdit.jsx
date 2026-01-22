import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect, useState } from "react";
import { buildUpdatePayload, coordToRegionWithGeocoder } from "../../apis/course/courseMapper";
import { Box, Container, Stack } from "@mui/system";
import { useKakaoPlaceSearch } from "../../hooks/useKakaoPlaceSearch";
import { Divider, Paper } from "@mui/material";
import CourseMiniBar from "../../components/Course/CourseMiniBar";
import CoursePanel from "../../components/Course/CoursePanel";
import PlaceSearchPanel from "../../components/Course/PlaceSearchPanel";
import CourseSavePanel from "../../components/Course/CourseSavePanel";

function CourseEdit({ course, setCourse, isEditing }) {
    const { mapRef, kakaoObj, points, setPoints, distanceM, map, undo, clear } = useCourseMap();

    const [panelOpen, setPanelOpen] = useState(false);
    const [region, setRegion] = useState(null);
    const [courseName, setCourseName] = useState("");

    const search = useKakaoPlaceSearch(kakaoObj, map);

    // points 저장
    useEffect(() => {
        if (!course) return;
        setCourseName(course.courseName);
        setPoints(
            course.points.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            })),
        );
    }, [course]);

    // center로 이동
    useEffect(() => {
        if (!kakaoObj || !map || !course) return;

        const { centerLat, centerLng } = course;

        if (typeof centerLat === "number" && typeof centerLng === "number") {
            const center = new kakaoObj.maps.LatLng(centerLat, centerLng);
            map.panTo(center);
        }
    }, [kakaoObj, map, course]);

    const handleUpdate = async () => {
        if (points.length < 2) {
            setError("포인트를 2개 이상 찍어주세요");
            return;
        }
        let regionInfo = region;

        if (!regionInfo && points[0]) {
            regionInfo = await coordToRegionWithGeocoder(kakaoObj, points[0].lat, points[0].lng);
            setRegion(regionInfo);
        }

        const payload = buildUpdatePayload({
            courseName,
            points,
            distanceM,
            region: regionInfo.region,
        });

        setCourse(payload);

        isEditing(false)
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 56, // ✅ 네비 높이만큼 제외
                display: "flex",
                justifyContent: "center",
                zIndex: 1400,
            }}
        >
            <Container disableGutters sx={{ position: "relative" }}>
                {/* 지도 */}
                <Box ref={mapRef} sx={{ width: "100%", height: "100%", zIndex: 10, overflow: "hidden" }} />

                {/* 미니바 + 확장 패널 */}
                <Paper
                    elevation={10}
                    sx={{
                        position: "absolute",
                        top: 30,
                        left: 30,
                        zIndex: 10,
                        width: 360,
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <CourseMiniBar pointsCount={points.length} distanceM={distanceM} onUndo={undo} onClear={clear} panelOpen={panelOpen} onTogglePanel={() => setPanelOpen((v) => !v)} />

                    <CoursePanel open={panelOpen}>
                        <Stack spacing={2} sx={{ p: 2 }}>
                            <PlaceSearchPanel
                                query={search.query}
                                setQuery={search.setQuery}
                                results={search.results}
                                loading={search.loading}
                                error={search.error}
                                onSearch={search.runSearch}
                                onSelectResult={(item) => {
                                    search.moveToResult(item);
                                    setPanelOpen(false);
                                }}
                            />

                            <Divider />

                            <CourseSavePanel courseName={courseName} setCourseName={setCourseName} onSave={handleUpdate} disabled={courseName.length < 1 || points.length < 2} onCancel={isEditing} />
                        </Stack>
                    </CoursePanel>
                </Paper>
            </Container>
        </Box>
    );
}

export default CourseEdit;
