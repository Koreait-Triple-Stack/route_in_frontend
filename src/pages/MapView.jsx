import { useRef, useState } from "react";
import { Box, Paper, Stack, Divider } from "@mui/material";

import { useKakaoCourseEditor } from "../hooks/useKakaoCourseEditor";
import { useKakaoPlaceSearch } from "../hooks/useKakaoPlaceSearch";

import CourseMiniBar from "../components/Course/CourseMiniBar";
import CoursePanel from "../components/Course/CoursePanel";
import PlaceSearchPanel from "../components/Course/PlaceSearchPanel";
import CourseSavePanel from "../components/Course/CourseSavePanel";
import { addCourseRequest } from "../apis/course/courseApi";

export default function MapView() {
    const mapDomRef = useRef(null);

    const [panelOpen, setPanelOpen] = useState(false);

    // 지도/경로 편집 훅
    const { kakaoObj, map, points, setPoints, distanceM, undo, clear } =
        useKakaoCourseEditor({
            containerRef: mapDomRef,
            // polylineColor: "#FF3D00",
            // startMarkerColor: "#2e7d32",
            // endMarkerColor: "#3F51B5",
            // startLabelBgRgba: "rgba(46,125,50,0.95)",
            // endLabelBgRgba: "rgba(63,81,181,0.95)",
        });

    // 검색 훅 (지도만 이동)
    const search = useKakaoPlaceSearch(kakaoObj, map);

    // 저장 UI 상태
    const [courseName, setCourseName] = useState("");
    const [saving, setSaving] = useState(false);

    const saveCourse = async () => {
        if (points.length < 2) {
            alert("경로는 최소 2개 이상의 점이 필요해요.");
            return;
        }

        const name = courseName.trim();
        if (!name) {
            alert("코스명을 입력해줘.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name,
                distanceM,
                points,
                pointsCount: points.length,
                centerLat: points[Math.floor(points.length / 2)].lat,
                centerLng: points[Math.floor(points.length / 2)].lng,
                isPublic: false,
            };

            addCourseRequest(payload).then((response) => {
                if (response.status === "success") {
                    alert(response.message)
                } else if (response.status === "failed") {
                    alert(response.message)
                }
            })

            setCourseName("");
            setPoints([]);
        } catch (e) {
            console.error(e);
            alert("저장 실패: " + (e?.message ?? "unknown"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ width: "100vw", height: "100vh", position: "relative" }}>
            {/* 지도 */}
            <Box ref={mapDomRef} sx={{ width: "100%", height: "100%" }} />

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
                    <Stack spacing={2}>
                        <PlaceSearchPanel
                            query={search.query}
                            setQuery={search.setQuery}
                            results={search.results}
                            loading={search.loading}
                            error={search.error}
                            onSearch={search.runSearch}
                            onSelectResult={(item) => {
                                search.moveToResult(item);
                                // 원하면 클릭 시 접기:
                                // setPanelOpen(false);
                            }}
                        />

                        <Divider />

                        <CourseSavePanel
                            courseName={courseName}
                            setCourseName={setCourseName}
                            onSave={saveCourse}
                            saving={saving}
                            disabled={points.length < 2}
                        />
                    </Stack>
                </CoursePanel>
            </Paper>
        </Box>
    );
}
