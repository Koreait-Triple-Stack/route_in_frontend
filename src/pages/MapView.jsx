import { useRef, useState } from "react";
import { Box, Paper, Stack, Divider } from "@mui/material";

import { useKakaoPlaceSearch } from "../hooks/useKakaoPlaceSearch";
import { useCourseMap } from "../hooks/useCourseMap";

import CourseMiniBar from "../components/Course/CourseMiniBar";
import CoursePanel from "../components/Course/CoursePanel";
import PlaceSearchPanel from "../components/Course/PlaceSearchPanel";
import CourseSavePanel from "../components/Course/CourseSavePanel";
import { addCourseRequest } from "../apis/course/courseApi";
import { addCourse } from "../apis/course/courseService";
import { buildPayload } from "../apis/course/courseMapper";

export default function MapView() {
    const mapDomRef = useRef(null);

    const [panelOpen, setPanelOpen] = useState(false);

    // 지도/경로 편집 훅
    const { kakaoObj, map, points, setPoints, distanceM, undo, clear } =
        useCourseMap({
            containerRef: mapDomRef,
        });

    // 검색 훅 (지도만 이동)
    const search = useKakaoPlaceSearch(kakaoObj, map);

    // 저장 UI 상태
    const [courseName, setCourseName] = useState("");
    const [saving, setSaving] = useState(false);

    const saveCourseHandler = async () => {
        setSaving(true);

        const result = await addCourse(buildPayload({
            courseName, distanceM, points
        }))

        setSaving(false);
        setCourseName("");

        if (!result.ok) {
            alert("저장에 실패했습니다.")
            return;
        }

        alert("저장 성공")
        console.log(result.data)
    }

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
                            onSave={saveCourseHandler}
                            saving={saving}
                            disabled={points.length < 2}
                        />
                    </Stack>
                </CoursePanel>
            </Paper>
        </Box>
    );
}
