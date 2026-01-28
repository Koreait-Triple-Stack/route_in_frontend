import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import Calendar from "./Calendar";

// 모달 껍데기
export default function AttendanceCalendarForm({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent>
                <Calendar />
            </DialogContent>
        </Dialog>
    );
}
