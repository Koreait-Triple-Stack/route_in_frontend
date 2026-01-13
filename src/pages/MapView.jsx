import { useEffect, useRef, useState } from "react";
import { loadKakaoMap } from "../apis/utils/useKaKaoMap";

function MapView() {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        loadKakaoMap().then((kakao) => {
            const container = mapRef.current;
            const options = {
                center: new kakao.maps.LatLng(37.5665, 126.978),
                level: 4,
            };

            const kakaoMap = new kakao.maps.Map(container, options);
            setMap(kakaoMap);
        });
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

export default MapView;
