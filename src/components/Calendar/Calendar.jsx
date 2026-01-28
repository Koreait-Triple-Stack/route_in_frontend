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

export default function Calendar() {
    const { principal } = usePrincipalState();
    const userId = principal?.userId;

    const [month, setMonth] = useState(() => dayjs().startOf("month"));
    const ym = month.format("YYYY-MM");

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
                    referenceDate={month}
                    onMonthChange={(m) => setMonth(dayjs(m).startOf("month"))}
                    slots={{ day: MarkedDay }}
                    slotProps={{ day: { markedSet } }}
                />
            </LocalizationProvider>
        </Paper>
    );
}
