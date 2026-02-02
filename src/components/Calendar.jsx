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
import { Box } from "@mui/system";

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

export default function Calendar({ open, onClose, lockMonth = false }) {
    const { principal } = usePrincipalState();

    // 현재 보고있는 월 상태
    const [month, setMonth] = useState(() => dayjs().startOf("month"));
    const ym = month.format("YYYY-MM");

    // 모달 열릴 때 이번달 부터 보여주기
    useEffect(() => {
        if (open) setMonth(dayjs().startOf("month"));
    }, [open]);

    // 출석 날짜 가져오기
    const { data } = useQuery({
        queryKey: ["AttendanceMonthDates", principal?.userId, ym],
        queryFn: () => getAttendanceMonthDates({ ym }),
        enabled: open && !!principal?.userId,
        staleTime: 0,
    });

    const markedSet = useMemo(() => new Set(data?.data ?? []), [data?.data]);

    return (
        
            <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="xs">
                <DialogContent sx={{ overflowX: "auto" }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={null}
                                referenceDate={month}
                                onMonthChange={(m) => {
                                    if (lockMonth) return;
                                    setMonth(dayjs(m).startOf("month"));
                                }}
                                slots={{ day: MarkedDay }}
                                slotProps={{
                                    day: { markedSet },
                                    previousIconButton: {
                                        disabled: lockMonth,
                                    },
                                    nextIconButton: { disabled: lockMonth },
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                </DialogContent>
            </Dialog>
    
    );
}
