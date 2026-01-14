export const buildPayload = ({
    userId,
    boardId,
    courseName,
    points,
    distanceM,
}) => ({
    userId,
    boardId,
    courseName,
    distanceM,
    pointsCount: points.length,
    centerLat: points[Math.floor(points.length / 2)]?.lat ?? null,
    centerLng: points[Math.floor(points.length / 2)]?.lng ?? null,
    points: (points ?? []).map((p, idx) => ({
        seq: idx + 1,
        lat: Number(p.lat),
        lng: Number(p.lng),
    })),
});
