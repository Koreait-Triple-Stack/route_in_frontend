import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Dialog, DialogContent, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { usePrincipalState } from "../store/usePrincipalState";
import { getAttendanceMonthDates } from "../apis/attendance/attendanceService";

// 출석날 표시
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

export default function Calendar({ open, onClose, lockCurrentMonth = false }) {
    const { principal } = usePrincipalState();

    // 현재 화면 보여주기
    const [month, setMonth] = useState(() => dayjs().startOf("month"));
    const ym = month.format("YYYY-MM");

    // 달력 닫았다가 열면 항상 현재 달 기준으로 보여주기
    useEffect(() => {
        if (open) setMonth(dayjs().startOf("month"));
    }, [open]);

    const { data } = useQuery({
        queryKey: ["getAttendanceMonthDates", principal?.userId, ym],
        queryFn: () => getAttendanceMonthDates({ ym }),
        enabled: open && !!principal?.userId,
        staleTime: 30000,
    });

    const markedSet = useMemo(() => new Set(data?.data ?? []), [data?.data]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent>
                <Paper
                    variant="outlined"
                    sx={{ borderRadius: 3, overflow: "hidden" }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            referenceDate={month}
                            showDaysOutsideCurrentMonth={false}
                            views={lockCurrentMonth ? ["day"] : ["year", "day"]}
                            onMonthChange={(m) => {
                                if (lockCurrentMonth) return;
                                setMonth(dayjs(m).startOf("month"));
                            }}
                            slots={{ day: MarkedDay }}
                            slotProps={{
                                day: { markedSet },
                                previousIconButton: {
                                    disabled: lockCurrentMonth,
                                },
                                nextIconButton: { disabled: lockCurrentMonth },
                            }}
                        />
                    </LocalizationProvider>
                </Paper>
            </DialogContent>
        </Dialog>
    );
}
