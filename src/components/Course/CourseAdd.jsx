import React, { useEffect, useRef, useState } from "react";
import { useKakaoPlaceSearch } from "../../hooks/useKakaoPlaceSearch";
import { addCourse } from "../../apis/course/courseService";
import { Box, Stack } from "@mui/system";
import { Divider, Paper } from "@mui/material";
import CourseMiniBar from "./CourseMiniBar";
import CoursePanel from "./CoursePanel";
import PlaceSearchPanel from "./PlaceSearchPanel";
import CourseSavePanel from "./CourseSavePanel";
import { useCourseMap } from "../../hooks/useCourseMap";
import {
    buildPayload,
    coordToRegionWithGeocoder,
} from "../../apis/course/courseMapper";
import { useMutation } from "@tanstack/react-query";

function CourseAdd({ userId, boardId }) {
    const { mapRef, kakaoObj, points, distanceM, map, undo, clear } =
        useCourseMap();

    const [panelOpen, setPanelOpen] = useState(false);
    const [courseName, setCourseName] = useState("");

    const search = useKakaoPlaceSearch(kakaoObj, map);

    const mutation = useMutation({
        mutationKey: ["addCourse"],
        mutationFn: (data) => addCourse(data),
        onSuccess: (response) => {
            console.log(response);
            alert(response.message);
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const saveCourseHandler = async () => {
        const regionInfo = await coordToRegionWithGeocoder(
            kakaoObj,
            points[0].lat,
            points[0].lng
        );

        const payload = buildPayload({
            userId,
            boardId,
            courseName,
            distanceM,
            points,
            region: regionInfo,
        });

        mutation.mutate(payload);
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
                                setPanelOpen(false);
                            }}
                        />

                        <Divider />

                        <CourseSavePanel
                            courseName={courseName}
                            setCourseName={setCourseName}
                            onSave={saveCourseHandler}
                            disabled={points.length < 2}
                        />
                    </Stack>
                </CoursePanel>
            </Paper>
        </Box>
    );
}

export default CourseAdd;
