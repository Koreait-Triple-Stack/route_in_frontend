import React, { useState } from "react";
import dayjs from "dayjs";
import { Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import { usePrincipalState } from "../../store/usePrincipalState";
import { getAttendanceMonthDates } from "../../apis/attendance/attendanceService";

function MarkedDay({ day, markedSet, ...other }) {
    const marked = markedSet.has(day.format("YYYY-MM-DD"));

    return (
        <PickersDay
            {...other}
            day={day}
            sx={
                marked
                    ? {
                          color: "error.main",
                          fontWeight: 900,
                          outline: "2px solid",
                          outlineOffset: -2,
                      }
                    : undefined
            }
        />
    );
}
export default function Calendar({ lockCurrentMonth = false }) {
    //lockCurrentMonth true로 주면 이번달만 false는 월 이동 가능
    const { principal } = usePrincipalState();
    const userId = principal?.userId;

    // 현재 달의 1일
    const now = dayjs().startOf("month");

    // 월 변경 상태를 위함
    const [month, setMonth] = useState(() => now);
    
    //메인 페이지: 항상 이번달, 마이 페이지: 모든 달
    const viewMonth = lockCurrentMonth ? now : month;
    const ym = viewMonth.format("YYYY-MM");

    const { data } = useQuery({
        queryKey: ["getAttendanceMonthDates", userId, ym],
        queryFn: () => getAttendanceMonthDates({ ym }),
        enabled: !!userId,
        staleTime: 30000,
    });
    // API가 준 날짜 배열을 Set으로 바꿈
    const markedSet = new Set(data?.data ?? []);

    // 메인페이지는 이번달 다음달 못가게 제한하기
    const minDate = lockCurrentMonth ? now : undefined;
    const maxDate = lockCurrentMonth ? now.endOf("month") : undefined;

    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    referenceDate={viewMonth}
                    onMonthChange={
                        lockCurrentMonth
                            ? undefined
                            : (m) => setMonth(dayjs(m).startOf("month"))
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                    slots={{ day: MarkedDay }}
                    slotProps={{ day: { markedSet } }}
                />
            </LocalizationProvider>
        </Paper>
    );
}
