import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Box, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import { usePrincipalState } from "../store/usePrincipalState";
import { getAttendanceMonthDates } from "../apis/attendance/attendanceService";
const START_DATE = dayjs("2026-01-01");
function MarkedDay(props) {
    const { day, outsideCurrentMonth, markedSet, ...other } = props;
    const key = day.format("YYYY-MM-DD");
    const marked = !outsideCurrentMonth && markedSet?.has(key);

    return (
        <PickersDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            sx={{
                borderRadius: 2,
                ...(marked && {
                    color: "error.main",
                    fontWeight: 900,
                    outline: "2px solid",
                    outlineOffset: -2,
                }),
            }}
        />
    );
}

export default function Calendar() {
    const { principal } = usePrincipalState();
    const myUserId = Number(principal?.userId ?? 0);

    const [value, setValue] = useState(START_DATE);
    const [ym, setYm] = useState(dayjs().format("YYYY-MM"));

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getAttendanceMonthDates", myUserId, ym],
        queryFn: () => getAttendanceMonthDates({ ym }),
        enabled: myUserId > 0,
        staleTime: 10000,
    });

    const markedSet = useMemo(() => new Set(data?.data ?? []), [data]);

    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ px: 2, py: 1.5 }}>
                <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                    출석 달력
                </Typography>
            </Box>

            <Box sx={{ px: 1.5, pb: 1.5 }}>
                {isError ? (
                    <Typography sx={{ color: "error.main", py: 1 }}>
                        달력을 불러오지 못했습니다.
                    </Typography>
                ) : isLoading ? (
                    <Typography sx={{ color: "text.secondary", py: 1 }}>
                        로딩중...
                    </Typography>
                ) : (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={value}
                            onChange={(v) => v && setValue(v)}
                            onMonthChange={(m) =>
                                setYm(dayjs(m).format("YYYY-MM"))
                            }
                            showDaysOutsideCurrentMonth={false}
                            minDate={START_DATE}
                            slots={{ day: MarkedDay }}
                            slotProps={{ day: { markedSet } }}
                        />
                    </LocalizationProvider>
                )}
            </Box>
        </Paper>
    );
}
