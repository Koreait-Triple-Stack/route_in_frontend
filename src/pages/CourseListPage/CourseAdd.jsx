import React, { useState } from "react";
import { useKakaoPlaceSearch } from "../../hooks/useKakaoPlaceSearch";
import { addCourse } from "../../apis/course/courseService";
import { Box, Container, Stack } from "@mui/system";
import { Divider, Paper } from "@mui/material";
import CoursePanel from "./CoursePanel";
import PlaceSearchPanel from "./PlaceSearchPanel";
import CourseSavePanel from "./CourseSavePanel";
import { useCourseMap } from "../../hooks/useCourseMap";
import { buildPayload, coordToRegionWithGeocoder } from "../../apis/course/courseMapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CourseMiniBar from "./CourseMiniBar";
import { NAV_H } from "../../components/BasicBottomNav";

function CourseAdd({ userId, boardId, isAdd }) {
    const { mapRef, kakaoObj, points, distanceM, map, undo, clear } = useCourseMap();
    const queryClient = useQueryClient();

    const [panelOpen, setPanelOpen] = useState(false);
    const [courseName, setCourseName] = useState("");

    const search = useKakaoPlaceSearch(kakaoObj, map);

    const mutation = useMutation({
        mutationKey: ["addCourse"],
        mutationFn: (data) => addCourse(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries([
                "getCourseListByUserId",
                userId,
            ]);
            setCourseName("");
            clear();
            alert(response.message);
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const saveCourseHandler = async () => {
        const regionInfo = await coordToRegionWithGeocoder(kakaoObj, points[0].lat, points[0].lng);

        const payload = buildPayload({
            userId,
            boardId,
            courseName,
            distanceM,
            points,
            region: regionInfo.region,
        });

        mutation.mutate(payload);

        isAdd(false);
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: NAV_H + 20,
                display: "flex",
                justifyContent: "center",
                zIndex: 1400,
            }}
        >
            <Container disableGutters sx={{ position: "relative" }}>
                <Box ref={mapRef} sx={{ width: "100%", height: "100%", zIndex: 10, overflow: "hidden" }} />

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
                                    setPanelOpen(false);
                                }}
                            />

                            <Divider />

                            <CourseSavePanel courseName={courseName} setCourseName={setCourseName} onSave={saveCourseHandler} disabled={courseName.length < 1 || points.length < 2} onCancel={isAdd} />
                        </Stack>
                    </CoursePanel>
                </Paper>
            </Container>
        </Box>
    );
}

export default CourseAdd;
