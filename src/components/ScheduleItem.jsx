import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button, TextField, Chip, Stack, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ScheduleItem = ({ day, routines, active, onReset, onSave, onToggle }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const [localRoutines, setLocalRoutines] = useState([]);
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        if (isEditing && routines) {
            setLocalRoutines([...routines]);
        }
    }, [isEditing, routines]);

    const handleAddLocal = () => {
        if (!inputText.trim()) return;
        
        const newRoutine = { 
            exercise: inputText, 
            routineId: null, 
            checked: 0 
        };
        setLocalRoutines([...localRoutines, newRoutine]);
        setInputText("");
    };

    const handleDeleteLocal = (indexToDelete) => {
        setLocalRoutines(localRoutines.filter((routine, index) => index !== indexToDelete));
    };

    const handleSaveClick = () => {
        if (onSave) {
            onSave(localRoutines); 
        }
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setInputText("");
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: active ? "#f0f7ff" : "white", borderColor: active ? "primary.light" : "grey.300" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box width={50} pt={1}>
                    <Typography variant="body1" fontWeight="bold" color="text.primary">
                        {day}
                    </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    {isEditing ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {localRoutines.map((routine, index) => (
                                    <Chip
                                        key={index}
                                        label={routine.exercise}
                                        onDelete={() => handleDeleteLocal(index)}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                                {localRoutines.length === 0 && <Typography variant="caption" color="text.secondary">등록된 운동이 없습니다.</Typography>}
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <TextField 
                                    size="small" 
                                    placeholder="예: 스쿼트" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    sx={{ flex: 1 }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddLocal()}
                                />
                                <Button 
                                    variant="outlined" 
                                    startIcon={<AddIcon />} 
                                    onClick={handleAddLocal}
                                    sx={{ whiteSpace: "nowrap" }}
                                >
                                    추가
                                </Button>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                                <Button size="small" color="inherit" onClick={handleCancelClick}>
                                    취소
                                </Button>
                                <Button size="small" variant="contained" onClick={handleSaveClick}>
                                    저장
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1,  alignItems: "center", minHeight: 32 }}>
                                {routines && routines.length > 0 ? routines.map((act, index) => (
                                    <Chip
                                        key={index}
                                        label={act.exercise}
                                        onClick={() => onToggle && onToggle(act)}
                                        sx={{
                                            cursor: "pointer",
                                            textDecoration: act.checked ? "line-through" : "none",
                                            bgcolor: act.checked ? "action.disabledBackground" : "primary.main",
                                            color: act.checked ? "text.disabled" : "white",
                                            "&:hover": { bgcolor: act.checked ? "action.disabledBackground" : "primary.dark" }
                                        }}
                                        size="small"
                                    />
                                )) : (
                                    <Typography variant="caption" color="text.secondary" sx={{ py: 0.5 }}>쉬는 날~</Typography>
                                )}
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                                <Button 
                                    size="small" 
                                    sx={{ minWidth: 40, px: 1, fontSize: "0.75rem" }} 
                                    onClick={() => setIsEditing(true)}
                                >
                                    수정
                                </Button>
                                <Button 
                                    size="small" 
                                    color="error" 
                                    sx={{ minWidth: 40, px: 1, fontSize: "0.75rem" }} 
                                    onClick={() => {
                                        if (confirm("정말 초기화 하시겠습니까?")) onReset();
                                    }}
                                >
                                    초기화
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default ScheduleItem;