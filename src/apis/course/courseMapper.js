const round6 = (v) => Math.round(v * 1e6) / 1e6;

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
        centerLat: round6((points[0].lat + points[points.length - 1].lat) / 2),
        centerLng: round6((points[0].lng + points[points.length - 1].lng) / 2),
        region,
        points: (points ?? []).map((p, idx) => ({
            seq: idx + 1,
            lat: Number(p.lat),
            lng: Number(p.lng),
        })),
    };
};

export const coordToRegionWithGeocoder = (kakao, lat, lng) =>
    new Promise((resolve) => {
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.coord2Address(lng, lat, (result, status) => {
            if (status !== kakao.maps.services.Status.OK) return resolve(null);

            const addr = result?.[0]?.address;
            if (!addr) return resolve(null);

            resolve({
                region: addr.address_name,
            });
        });
    });

export const buildUpdatePayload = ({
    courseId,
    userId,
    boardId,
    courseName,
    points,
    distanceM,
    region,
}) => ({
    courseId,
    userId,
    boardId,
    courseName,
    distanceM,
    centerLat: round6((points[0].lat + points[points.length - 1].lat) / 2),
    centerLng: round6((points[0].lng + points[points.length - 1].lng) / 2),
    region,
    points: (points ?? []).map((p, idx) => ({
        seq: idx + 1,
        lat: Number(p.lat),
        lng: Number(p.lng),
    })),
});
