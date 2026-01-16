import React, { useState } from "react";
import { Typography, Box, Paper, Button, TextField } from "@mui/material";

const ScheduleItem = ({ day, routines, active, onReset, onUpdate, onToggle, onAdd, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [activitiesValue, setActivitiesValue] = useState("");

    const handleEditClick = () => {
        const text = routines ? routines.filter((id) => id.userId === 18).map((ex) => ex.exercise) : "";
        setActivitiesValue(text);
        setIsEditing(true);
    };

    const handleAddClick = () => {
        if (onAdd) {
            const newText = activitiesValue;
            onAdd(newText);
        }
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        if (onUpdate) {
            const newTexts = activitiesValue;
            onUpdate(newTexts);
        }
        setIsEditing(false);
    };

    const handleReset = () => {
        if (confirm("운동 목록을 초기화하시겠습니까?")) {
            if (onReset) onReset();
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: active ? "#f0f7ff" : "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 80 }}>
                <Box width={50}>
                    <Typography variant="body2" fontWeight="bold">
                        {day}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "start", width: 380, alignItems: "center", flexWrap: "wrap" }}>
                    {isEditing
                        ? // <TextField fullWidth variant="standard" onChange={(e) => setActivitiesValue(e.target.value)} placeholder="예: 스쿼트, 런지" />
                          routines?.length !== 0 && routines?.map((act, index) => <Button key={index}>{act.exercise}</Button>)
                        : routines?.length !== 0 &&
                          routines?.map((act, index) => (
                              <Typography
                                  key={index}
                                  variant="caption"
                                  onClick={() => onToggle && onToggle(act)}
                                  sx={{
                                      fontWeight: "bold",
                                      margin: 0,
                                      cursor: "pointer",
                                      textDecoration: act.checked ? "line-through" : "none",
                                      color: act.checked ? "#aaa" : "primary.main",
                                      border: act.checked ? "1px solid #ddd" : "1px solid transparent",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      "&:hover": { bgcolor: "#f0f0f0" },
                                  }}
                              >
                                  {act.exercise}
                              </Typography>
                          ))}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {isEditing ? (
                        <>
                            <Button size="small" variant="contained" onClick={handleSaveClick}>
                                저장
                            </Button>
                            <Button size="small" variant="contained" onClick={handleAddClick}>
                                추가
                            </Button>
                            <Button size="small" color="inherit" onClick={() => setIsEditing(false)}>
                                취소
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="small" onClick={handleEditClick}>
                                수정
                            </Button>
                            <Button size="small" color="error" onClick={handleReset}>
                                초기화
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default ScheduleItem;
