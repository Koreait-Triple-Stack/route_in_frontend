import { instance } from "../utils/instance";

export const getAttendanceMonthDatesRequest = (ym) => {
    return instance.get("/attendance/month", { params: { ym } });
};
