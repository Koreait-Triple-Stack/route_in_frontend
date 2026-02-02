import { useRef, useState } from "react";

export function useKakaoPlaceSearch(kakaoObj, map) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const markerRef = useRef(null); // ✅ 핑(마커) 1개 유지용

    const runSearch = () => {
        if (!kakaoObj || !map) return;

        if (!kakaoObj.maps?.services?.Places) {
            setError("카카오맵 services 미로딩 (libraries=services 필요)");
            return;
        }

        const keyword = query.trim();
        if (!keyword) return;

        setLoading(true);
        setError("");
        setResults([]);

        const ps = new kakaoObj.maps.services.Places();
        ps.keywordSearch(keyword, (data, status) => {
            setLoading(false);

            if (status !== kakaoObj.maps.services.Status.OK || !data?.length) {
                setError("검색 결과가 없어요");
                return;
            }
            setResults(data.slice(0, 5));
        });
    };

    const moveToResult = (item) => {
        if (!kakaoObj || !map) return;

        const lat = Number(item.y);
        const lng = Number(item.x);
        const pos = new kakaoObj.maps.LatLng(lat, lng);

        // ✅ (1) 레벨 조정: 원하는 줌으로 고정
        map.setLevel(3, { animate: true }); // 숫자 낮을수록 확대 (원하는 값으로 조절)

        // ✅ (2) 지도 이동
        map.panTo(pos);

        // ✅ (3) 기존 핑 제거 후 새로 찍기 (항상 1개만)
        if (markerRef.current) {
            markerRef.current.setMap(null);
            markerRef.current = null;
        }

        markerRef.current = new kakaoObj.maps.Marker({
            position: pos,
            map,
        });

        setResults([]);
        setQuery("");
    };

    const clearMarker = () => {
        if (markerRef.current) {
            markerRef.current.setMap(null);
            markerRef.current = null;
        }
    };

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        runSearch,
        moveToResult,
        setResults,
        setError,
        clearMarker, // 필요시 외부에서 핑 제거 가능
    };
}
