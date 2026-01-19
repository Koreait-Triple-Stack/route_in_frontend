import { useCallback, useEffect, useRef, useState } from "react";
import { loadKakaoMap } from "../apis/utils/useKaKaoMap";

export function useCourseMap({
    initialCenter = { lat: 37.5665, lng: 126.978 },
    level = 5,
    polylineColor = "#FF3D00",
    startMarkerColor = "#2e7d32",
    endMarkerColor = "#3F51B5",
    startLabelBgRgba = "rgba(46,125,50,0.95)",
    endLabelBgRgba = "rgba(63,81,181,0.95)",
    fitPadding = 72,
    enableClickAdd = true,
    fitOnPointsChange = false,
} = {}) {
    const [kakaoObj, setKakaoObj] = useState(null);
    const [map, setMap] = useState(null);

    const [points, setPoints] = useState([]); // [{lat,lng}]
    const [distanceM, setDistanceM] = useState(0);

    const mapRef = useRef(null);
    const polylineRef = useRef(null);
    const startMarkerRef = useRef(null);
    const endMarkerRef = useRef(null);
    const startLabelRef = useRef(null);
    const endLabelRef = useRef(null);

    const clickHandlerRef = useRef(null)

    const getLatLng = (latLng) => {
        if (!latLng) return null;

        // 일반적인 LatLng
        if (
            typeof latLng.getLat === "function" &&
            typeof latLng.getLng === "function"
        ) {
            return { lat: latLng.getLat(), lng: latLng.getLng() };
        }
        // 내부 필드로 오는 케이스(qa: { Ma: lat, La: lng })
        if (typeof latLng.Ma === "number" && typeof latLng.La === "number") {
            return { lat: latLng.Ma, lng: latLng.La };
        }
        return null;
    };

    const round6 = (v) => Math.round(v * 1e6) / 1e6;

    const makePinSvg = (color) => {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="12" fill="${color}" />
                <circle cx="18" cy="18" r="5" fill="white" opacity="0.95"/>
            </svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    };

    const createMarkerImage = (kakao, color) => {
        const src = makePinSvg(color);
        const size = new kakao.maps.Size(36, 36);
        const option = { offset: new kakao.maps.Point(18, 18) };
        return new kakao.maps.MarkerImage(src, size, option);
    };

    const clearMapObjects = () => {
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }
        if (startMarkerRef.current) {
            startMarkerRef.current.setMap(null);
            startMarkerRef.current = null;
        }
        if (endMarkerRef.current) {
            endMarkerRef.current.setMap(null);
            endMarkerRef.current = null;
        }
        if (startLabelRef.current) {
            startLabelRef.current.setMap(null);
            startLabelRef.current = null;
        }
        if (endLabelRef.current) {
            endLabelRef.current.setMap(null);
            endLabelRef.current = null;
        }
    };

    const fitBoundsToPoints = useCallback(
        (pts, options = {}) => {
            if (!kakaoObj || !map) return;
            const arr = pts ?? points;
            if (!arr || arr.length == 0) return;

            const bounds = new kakaoObj.maps.LatLngBounds();
            arr.forEach((p) => bounds.extend(new kakaoObj.maps.LatLng(p.lat, p.lng)))

            const pad = options.padding ?? fitPadding
            map.setBounds(bounds, pad, pad, pad, pad)
        }, [kakaoObj, map, points, fitPadding]
    )

    // 1) 지도 생성
    useEffect(() => {
        let alive = true;

        loadKakaoMap()
            .then((kakao) => {
                if (!alive) return;
                setKakaoObj(kakao);

                const el = mapRef.current;
                if (!el) return;

                const options = {
                    center: new kakao.maps.LatLng(
                        initialCenter.lat,
                        initialCenter.lng
                    ),
                    level,
                };

                const kakaoMap = new kakao.maps.Map(el, options);
                setMap(kakaoMap);
            })
            .catch(console.error);

        return () => {
            alive = false;

            if (kakaoObj && map && clickHandlerRef.current) {
                kakaoObj.maps.event.removeListener(map, "click", clickHandlerRef.current);
            }

            clearMapObjects();
            setMap(null);
            setKakaoObj(null);
        };
    }, []);

    // 2) 지도 클릭 -> 포인트 추가
    useEffect(() => {
        if (!kakaoObj || !map) return;
        if (!enableClickAdd) return;

        const handleClick = (mouseEvent) => {
            const p = getLatLng(mouseEvent?.latLng);
            if (!p) return;

            setPoints((prev) => [
                ...prev,
                { lat: round6(p.lat), lng: round6(p.lng) },
            ]);
        };

        kakaoObj.maps.event.addListener(map, "click", handleClick);
        return () => {
            kakaoObj.maps.event.removeListener(map, "click", handleClick);
        };
    }, [kakaoObj, map]);

    // 3) points 변경 -> 출발/도착 마커+라벨, 폴리라인, 거리 갱신
    useEffect(() => {
        if (!kakaoObj || !map) return;

        if (points.length === 0) {
            setDistanceM(0);
            clearMapObjects();
            return;
        }

        // 기존 폴리라인 제거(매번 재생성)
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }

        const start = points[0];
        const end = points[points.length - 1];

        const startPos = new kakaoObj.maps.LatLng(start.lat, start.lng);
        const endPos = new kakaoObj.maps.LatLng(end.lat, end.lng);

        const startImg = createMarkerImage(kakaoObj, startMarkerColor);
        const endImg = createMarkerImage(kakaoObj, endMarkerColor);

        // START marker
        if (!startMarkerRef.current) {
            startMarkerRef.current = new kakaoObj.maps.Marker({
                position: startPos,
                image: startImg,
                zIndex: 10,
            });
            startMarkerRef.current.setMap(map);
        } else {
            startMarkerRef.current.setPosition(startPos);
            startMarkerRef.current.setImage(startImg);
        }

        // START label
        const startLabelHtml = `
            <div style="
                pointer-events:none;
                transform: translate(-50%, -120%);
                background: ${startLabelBgRgba};
                color: #fff;
                padding: 4px 8px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 700;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                white-space: nowrap;
            ">START</div>
        `;

        if (!startLabelRef.current) {
            startLabelRef.current = new kakaoObj.maps.CustomOverlay({
                position: startPos,
                content: startLabelHtml,
                yAnchor: 1,
                zIndex: 11,
            });
            startLabelRef.current.setMap(map);
        } else {
            startLabelRef.current.setPosition(startPos);
        }

        // END marker/label
        if (points.length === 1) {
            setDistanceM(0);

            if (endMarkerRef.current) {
                endMarkerRef.current.setMap(null);
                endMarkerRef.current = null;
            }
            if (endLabelRef.current) {
                endLabelRef.current.setMap(null);
                endLabelRef.current = null;
            }
            return;
        }

        if (!endMarkerRef.current) {
            endMarkerRef.current = new kakaoObj.maps.Marker({
                position: endPos,
                image: endImg,
                zIndex: 10,
            });
            endMarkerRef.current.setMap(map);
        } else {
            endMarkerRef.current.setPosition(endPos);
            endMarkerRef.current.setImage(endImg);
        }

        const endLabelHtml = `
            <div style="
                pointer-events:none;
                transform: translate(-50%, -120%);
                background: ${endLabelBgRgba};
                color: #fff;
                padding: 4px 8px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 700;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                white-space: nowrap;
            ">END</div>
        `;
        
        if (!endLabelRef.current) {
            endLabelRef.current = new kakaoObj.maps.CustomOverlay({
                position: endPos,
                content: endLabelHtml,
                yAnchor: 1,
                zIndex: 11,
            });
            endLabelRef.current.setMap(map);
        } else {
            endLabelRef.current.setPosition(endPos);
        }

        // Polyline + distance
        const path = points.map((p) => new kakaoObj.maps.LatLng(p.lat, p.lng));
        const polyline = new kakaoObj.maps.Polyline({
            path,
            strokeWeight: 7,
            strokeColor: polylineColor,
            strokeOpacity: 1,
            strokeStyle: "solid",
        });
        polyline.setMap(map);
        polylineRef.current = polyline;

        setDistanceM(Math.round(polyline.getLength())); // meters
    }, [
        points,
        kakaoObj,
        map,
        polylineColor,
        startMarkerColor,
        endMarkerColor,
        startLabelBgRgba,
        endLabelBgRgba,
        clearMapObjects,
        fitPadding,
    ]);

    const undo = () => setPoints((prev) => prev.slice(0, -1));
    const clear = () => setPoints([]);

    return {
        mapRef,
        kakaoObj,
        map,
        points,
        setPoints,
        distanceM,
        undo,
        clear,
        fitBoundsToPoints,
    };
}
