export function timeAgo(dateInput) {
    const date = new Date(dateInput);
    const now = new Date();

    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 1000 / 60);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;

    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}일 전`;

    return date.toLocaleDateString("ko-KR");
}
