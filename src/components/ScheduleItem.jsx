import React, { useState, useEffect } from "react";
import {
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    Chip,
    Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DialogComponent from "./DialogComponent";
import { usePrincipalState } from "../store/usePrincipalState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeChecked } from "../apis/routine/routineService";
import { Grid } from "@mui/system";

const ScheduleItem = ({ dayEng, day, routines, active, onReset, onSave }) => {
    const { principal } = usePrincipalState();
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const [localRoutines, setLocalRoutines] = useState([]);
    const [inputText, setInputText] = useState("");
    const [openReset, setOpenReset] = useState(false);
    const checkedMutation = useMutation({
        mutationFn: (routineId) => changeChecked(routineId),
        onSuccess: () =>
            queryClient.invalidateQueries(["getRoutine", principal?.userId]),
        onError: (error) => {
            alert(error.message);
        },
    });

    useEffect(() => {
        if (isEditing && routines) {
            setLocalRoutines([...routines]);
        }
    }, [isEditing, routines]);

    const handleAddLocal = () => {
        if (!inputText.trim()) return;
        const newRoutine = {
            routineId: null,
            userId: principal?.userId,
            exercise: inputText,
            weekday: dayEng,
        };
        setLocalRoutines([...localRoutines, newRoutine]);
        setInputText("");
    };

    const handleDeleteLocal = (indexToDelete) => {
        setLocalRoutines(
            localRoutines.filter((_, index) => index !== indexToDelete),
        );
    };

    const handleSaveClick = () => {
        setInputText("");
        if (onSave) onSave(localRoutines);
        setIsEditing(false);
    };

    const THEME = {
        accent: "#3f98f8",
        text: "#0F172A",
        activeBg: "#F0F9FF",
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1,
                mb: 1.2,
                borderRadius: "16px",
                bgcolor: active ? THEME.activeBg : "#FFFFFF",
                border: `1px solid ${active ? THEME.accent : "#bbbdbe"}`,
                transition: "all 0.2s ease-in-out",
                overflow: "hidden",
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: active ? THEME.accent : "#ffffff",
                        color: active ? "white" : THEME.text,
                        flexShrink: 0,
                    }}>
                    <Typography variant="body1" fontWeight="800">
                        {day}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                        <Stack spacing={1.5}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.8,
                                }}>
                                {localRoutines.map((routine, index) => (
                                    <Chip
                                        key={index}
                                        label={routine.exercise}
                                        onDelete={() =>
                                            handleDeleteLocal(index)
                                        }
                                        sx={{
                                            bgcolor: "#F0F9FF",
                                            color: "#0369A1",
                                            fontSize: "0.75rem",
                                            borderRadius: "6px",
                                        }}
                                        size="small"
                                    />
                                ))}
                            </Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap" }}>
                                <TextField
                                    size="small"
                                    placeholder="운동 입력"
                                    value={inputText}
                                    onChange={(e) =>
                                        setInputText(e.target.value)
                                    }
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "10px",
                                            bgcolor: "#fff",
                                            minWidth: 0,
                                        },
                                    }}
                                />
                                <Button
                                    onClick={handleAddLocal}
                                    variant="contained"
                                    sx={{
                                        bgcolor: THEME.accent,
                                        minWidth: 50,
                                        borderRadius: "10px",
                                        boxShadow: "none",
                                        flexShrink: 0,
                                    }}>
                                    <AddIcon />
                                </Button>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                sx={{ flexWrap: "wrap", gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setInputText("");
                                    }}
                                    sx={{
                                        boxShadow: "none",
                                        borderRadius: "8px",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                    }}>
                                    취소
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleSaveClick}
                                    sx={{
                                        bgcolor: THEME.accent,
                                        boxShadow: "none",
                                        borderRadius: "8px",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                    }}>
                                    저장
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            <Grid container spacing={1}>
                                {routines?.length > 0 ? (
                                    routines.map((act, index) => (
                                        <Chip
                                            key={index}
                                            label={act.exercise}
                                            onClick={() =>
                                                checkedMutation.mutate(
                                                    act.routineId,
                                                )
                                            }
                                            size="small"
                                            sx={{
                                                cursor: "pointer",
                                                borderRadius: "6px",
                                                fontSize: "0.8rem",
                                                fontWeight: 600,

                                                minWidth: 0,
                                                maxWidth: {
                                                    xs: "100%",
                                                    sm: 200,
                                                },

                                                textDecoration: act.checked
                                                    ? "line-through"
                                                    : "none",
                                                bgcolor: act.checked
                                                    ? "#F1F5F9"
                                                    : "#E0F2FE",
                                                color: act.checked
                                                    ? "#CBD5E1"
                                                    : "#0369A1",
                                                border: "none",

                                                "& .MuiChip-label": {
                                                    minWidth: 0,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    display: "block",
                                                },

                                                "&:hover": {
                                                    bgcolor: "#BAE6FD",
                                                },
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "#424245" }}>
                                        쉬는 날
                                    </Typography>
                                )}
                            </Grid>

                            <Stack spacing={1}>
                                <Button
                                    size="small"
                                    onClick={() => setIsEditing(true)}
                                    sx={{
                                        color: "#0284C7",
                                        fontSize: "0.7rem",
                                    }}>
                                    수정
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setOpenReset(true)}
                                    sx={{
                                        color: "#fc6b7c",
                                        fontSize: "0.7rem",
                                    }}>
                                    초기화
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </Box>
            </Box>
            <DialogComponent
                open={openReset}
                setOpen={setOpenReset}
                title="초기화"
                content="초기화 하시겠습니까?"
                onClick={onReset}
                color="error"
            />
        </Paper>
    );
};

export default ScheduleItem;
