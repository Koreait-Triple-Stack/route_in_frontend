import {
  getAttendanceMonthDatesRequest,
  updateAttendancePopupShownTodayRequest,
} from "./attendanceApi";

export const getAttendanceMonthDates = async ({ ym }) => {
  const result = await getAttendanceMonthDatesRequest(ym);
  if (result.data.status !== "success") throw new Error(result.data.message);
  return result.data; 
};

export const updateAttendancePopupShownToday = async () => {
  const result = await updateAttendancePopupShownTodayRequest();
  if (result.data.status !== "success") throw new Error(result.data.message);
  return result.data;
};
