import { getAttendanceMonthDatesRequest } from "./attendanceApi";

export const getAttendanceMonthDates = async ({ ym }) => {
    const result = await getAttendanceMonthDatesRequest(ym);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};
