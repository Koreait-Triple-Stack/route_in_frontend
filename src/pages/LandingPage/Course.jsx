import React, { useEffect } from "react";
import { getCourseByBoardId } from "../../apis/course/courseService";
import { useCourseMap } from "../../hooks/useCourseMap";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/system";

function Course({boardId}) {
    const {
        data: response,
    } = useQuery({
        queryKey: ["getCourseByBoardId", boardId],
        queryFn: () => getCourseByBoardId(boardId),
        enabled: !!boardId && boardId > 0,
    });

    const { mapRef, map, kakaoObj, setPoints } = useCourseMap({
        enableClickAdd: false,
    });

    useEffect(() => {
        if (!kakaoObj || !map || !response?.data) return;

        const { centerLat, centerLng } = response?.data;

        if (typeof centerLat === "number" && typeof centerLng === "number") {
            const center = new kakaoObj.maps.LatLng(centerLat, centerLng);
            map.panTo(center);
        }
    }, [kakaoObj, map, response]);

    useEffect(() => {
        if (!response?.data?.points) return;
        setPoints(
            response?.data?.points.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            })),
        );
    }, [response?.data]);

    return (
        <Box
            sx={{
                mt: 2,
                height: 190,
                borderRadius: "18px",
                border: "1px solid rgba(15,23,42,0.10)",
            }}
        >
            <Box
                ref={mapRef}
                sx={{
                    height: 190,
                }}
            />
        </Box>
    );
}

export default Course;
