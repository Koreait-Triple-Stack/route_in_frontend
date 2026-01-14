import { useState } from "react";

/**
 * @param {any} kakaoObj
 * @param {any} map
 */
export function useKakaoPlaceSearch(kakaoObj, map) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

        map.panTo(pos); // ✅ 지도만 이동
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
    };
}
