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

const START_DATE = dayjs("2026-01-01");

function MarkedDay({ day, outsideCurrentMonth, markedSet, ...other }) {
    const marked =
        !outsideCurrentMonth && markedSet.has(day.format("YYYY-MM-DD"));

    return (
        <PickersDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
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

export default function Calendar({ fixedCurrentMonth = false }) {
    const userId = usePrincipalState().principal?.userId;

    // 현재 기준으로 달력을 보여줌
    const now = dayjs().startOf("month");
    const viewMonth = fixedCurrentMonth ? now : month;

    
    const [month, setMonth] = useState(now);
    
    const ym = viewMonth.format("YYYY-MM");

    const { data } = useQuery({
        queryKey: ["getAttendanceMonthDates", userId, ym],
        queryFn: () => getAttendanceMonthDates({ ym }),
        enabled: !!userId,
        staleTime: 30000,
    });

    const markedSet = new Set(data?.data ?? []);

    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    referenceDate={viewMonth}
                    onMonthChange={
                        fixedCurrentMonth
                            ? undefined
                            : (m) => setMonth(dayjs(m).startOf("month"))
                    }
                    slots={{ day: MarkedDay }}
                    slotProps={{ day: { markedSet } }}
                />
            </LocalizationProvider>
        </Paper>
    );
}
