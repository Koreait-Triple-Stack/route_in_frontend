export function loadKakaoMap() {
    return new Promise((resolve, reject) => {
        console.log("KAKAO KEY:", import.meta.env.VITE_KAKAO_MAP_KEY);

        if (window.kakao && window.kakao.maps) {
            resolve(window.kakao);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
            import.meta.env.VITE_KAKAO_MAP_KEY
        }&autoload=false`;
        script.async = true;

        script.onload = () => {
            console.log("Kakao SDK loaded");
            window.kakao.maps.load(() => {
                resolve(window.kakao);
            });
        };

        script.onerror = (e) => {
            console.error("Kakao SDK load failed", e);
            reject(e);
        };

        document.head.appendChild(script);
    });
}
