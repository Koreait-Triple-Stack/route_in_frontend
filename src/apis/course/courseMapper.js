export const buildPayload = ({
    userId,
    boardId,
    courseName,
    points,
    distanceM,
    region,
}) => {
    return {
    userId,
    boardId,
    courseName,
    distanceM,
    centerLat: points[Math.floor(points.length / 2)]?.lat ?? null,
    centerLng: points[Math.floor(points.length / 2)]?.lng ?? null,
    si: region.si,
    gu: region.gu,
    dong: region.dong,
    points: (points ?? []).map((p, idx) => ({
        seq: idx + 1,
        lat: Number(p.lat),
        lng: Number(p.lng),
    })),
}};

export const coordToRegionWithGeocoder = (kakao, lat, lng) =>
    new Promise((resolve) => {
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.coord2Address(lng, lat, (result, status) => {
            if (status !== kakao.maps.services.Status.OK) return resolve(null);

            const addr = result?.[0]?.address;
            if (!addr) return resolve(null);

            resolve({
                si: addr.region_1depth_name,
                gu: addr.region_2depth_name,
                dong: addr.region_3depth_name,
                fullAddress: addr.address_name, // 필요하면 같이 저장
            });
        });
    });

export const buildUpdatePayload = ({ courseName, points, distanceM, region }) => ({
    courseName,
    distanceM,
    centerLat: points[Math.floor(points.length / 2)]?.lat ?? null,
    centerLng: points[Math.floor(points.length / 2)]?.lng ?? null,
    si: region.si,
    gu: region.gu,
    dong: region.dong,
    points: (points ?? []).map((p, idx) => ({
        seq: idx + 1,
        lat: Number(p.lat),
        lng: Number(p.lng),
    })),
});
