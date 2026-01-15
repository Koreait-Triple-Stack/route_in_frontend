import { useNavigate, useParams } from "react-router-dom";
import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect, useState } from "react";
import {
    buildUpdatePayload,
    coordToRegionWithGeocoder,
} from "../../apis/course/courseMapper";
import { updateCourse } from "../../apis/course/courseService";
import { Box, padding, Stack } from "@mui/system";
import { useKakaoPlaceSearch } from "../../hooks/useKakaoPlaceSearch";
import { Alert, Divider, Paper } from "@mui/material";
import CourseMiniBar from "./CourseMiniBar";
import CoursePanel from "./CoursePanel";
import PlaceSearchPanel from "./PlaceSearchPanel";
import CourseSavePanel from "./CourseSavePanel";

function CourseEdit({ course }) {
    const navigate = useNavigate();

    const {
        mapRef,
        kakaoObj,
        points,
        setPoints,
        distanceM,
        map,
        undo,
        clear,
    } = useCourseMap();

    const [panelOpen, setPanelOpen] = useState(false);
    const [region, setRegion] = useState(null);
    const [courseName, setCourseName] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const search = useKakaoPlaceSearch(kakaoObj, map);

    useEffect(() => {
        setPoints(
            result.data.points.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            }))
        );
    }, [course]);

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

        setSaving(true);
        setError(null);

        try {
            let regionInfo = region;

            if (!regionInfo && points[0]) {
                regionInfo = await coordToRegionWithGeocoder(
                    kakaoObj,
                    points[0].lat,
                    points[0].lng
                );
                setRegion(regionInfo);
            }

            const result = await updateCourse(
                buildUpdatePayload({
                    courseId: course.courseId,
                    userId: course.userId,
                    boardId: course.boardId,
                    courseName,
                    points,
                    distanceM,
                    region: regionInfo,
                })
            );

            if (!result.ok) {
                setError(result.message);
                return;
            }

            alert("수정 완료");
            navigate(-1);
        } catch (e) {
            setError(e?.message ?? "수정 중 오류가 발생했습니다");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ width: "100vw", height: "100vh", position: "relative" }}>
            {/* 지도 */}
            <Box ref={mapRef} sx={{ width: "100%", height: "100%" }} />

            {/* 미니바 + 확장 패널 */}
            <Paper
                elevation={10}
                sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 10,
                    width: { xs: "calc(100% - 24px)", sm: 360 },
                    borderRadius: 2,
                    overflow: "hidden",
                }}>
                <CourseMiniBar
                    pointsCount={points.length}
                    distanceM={distanceM}
                    onUndo={undo}
                    onClear={clear}
                    panelOpen={panelOpen}
                    onTogglePanel={() => setPanelOpen((v) => !v)}
                />

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

                        <CourseSavePanel
                            courseName={courseName}
                            setCourseName={setCourseName}
                            onSave={handleUpdate} // ✅ 수정 저장 연결
                            saving={saving}
                            disabled={points.length < 2}
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                    </Stack>
                </CoursePanel>
            </Paper>
        </Box>
    );
}

export default CourseEdit;
