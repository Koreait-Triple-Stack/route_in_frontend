import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import {
    changeCurrentRun,
    changeWeeklyRun,
    getUserByUserId,
} from "../../apis/account/accountService";
import {
    Box,
    Button,
    Divider,
    Paper,
    Typography,
    Stack,
    TextField,
} from "@mui/material";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";

function RunningRecord({ userId }) {
    const queryClient = useQueryClient();
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    const [isEditing, setIsEditing] = useState(false);
    const [currentValues, setCurrentValues] = useState(Array(7).fill(0));
    const [weeklyValues, setWeeklyValues] = useState(Array(7).fill(0));

    const THEME = {
        accent: "#3B82F6",
        bgLight: "#F1F5F9",
        border: "#E2E8F0",
        textMain: "#1E293B",
    };

    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getUserByUserId", userId],
        queryFn: () => getUserByUserId(userId),
        staleTime: 30000,
        enabled: !!userId,
    });

    const updateWeeklyRunMutation = useMutation({
        mutationFn: changeWeeklyRun,
        onSuccess: () =>
            queryClient.invalidateQueries(["getUserByUserId", userId]),
        onError: (error) => alert(error.message),
    });

    const updateCurrentRunMutation = useMutation({
        mutationFn: changeCurrentRun,
        onSuccess: () =>
            queryClient.invalidateQueries(["getUserByUserId", userId]),
        onError: (error) => alert(error.message),
    });

    useEffect(() => {
        if (response?.data?.weeklyRun) setWeeklyValues(response.data.weeklyRun);
        if (response?.data?.currentRun)
            setCurrentValues(response.data.currentRun);
    }, [response]);

    const handleWeeklyChange = (index, value) => {
        const newValues = [...weeklyValues];
        newValues[index] = value;
        setWeeklyValues(newValues);
    };

    const handleCurrentChange = (index, value) => {
        const newValues = [...currentValues];
        newValues[index] = value;
        setCurrentValues(newValues);
    };

    const handleSave = () => {
        updateCurrentRunMutation.mutate({ userId, currentRun: currentValues });
        updateWeeklyRunMutation.mutate({ userId, weeklyRun: weeklyValues });
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (response?.data?.currentRun)
            setCurrentValues(response.data.currentRun);
        if (response?.data?.weeklyRun) setWeeklyValues(response.data.weeklyRun);
        setIsEditing(false);
    };

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                bgcolor: "white",
                borderRadius: "20px",
                border: `1px solid ${THEME.border}`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: "0.9rem", sm: "1.1rem" },
                            fontWeight: "bold",
                            color: "text.primary",
                        }}>
                        러닝 기록 / 주간 목표
                    </Typography>

                    <Box>
                        {isEditing ? (
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={handleCancel}
                                    sx={{
                                        fontSize: {
                                            xs: "0.75rem",
                                            sm: "0.8rem",
                                        },
                                        minWidth: "auto",
                                        px: 2,
                                    }}>
                                    취소
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleSave}
                                    sx={{
                                        fontSize: {
                                            xs: "0.75rem",
                                            sm: "0.8rem",
                                        },
                                        minWidth: "auto",
                                        px: 2,
                                    }}>
                                    저장
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                size="small"
                                onClick={() => setIsEditing(true)}
                                sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                                    minWidth: "auto",
                                }}>
                                수정
                            </Button>
                        )}
                    </Box>
                </Box>

                <Divider />

                <Box sx={{ width: "100%" }}>
                    <Stack
                        direction="row"
                        sx={{
                            width: "100%",
                            justifyContent: "space-between",
                            bgcolor: THEME.bgLight,
                            borderRadius: "12px",
                        }}>
                        {days.map((day, index) => (
                            <Box
                                key={day}
                                sx={{
                                    flex: 1,
                                    textAlign: "center",
                                }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 1, fontSize: "0.8rem" }}>
                                    {day}
                                </Typography>

                                <Box
                                    sx={{
                                        height: "30px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                    }}>
                                    {isEditing ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "2px",
                                            }}>
                                            <TextField
                                                variant="standard"
                                                value={currentValues[index]}
                                                onChange={(e) =>
                                                    handleCurrentChange(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        color: "#3B82F6",
                                                        padding: 0,
                                                    },
                                                    inputMode: "numeric",
                                                    pattern: "[0-9]*",
                                                }}
                                                sx={{
                                                    width: "20px",
                                                    "& .MuiInput-root": {
                                                        fontSize: "0.9rem",
                                                    },
                                                    "& .MuiInput-underline:before":
                                                        {
                                                            borderBottom:
                                                                "1px solid #ddd",
                                                        },
                                                }}
                                            />
                                            <Typography
                                                sx={{
                                                    color: "text.secondary",
                                                    fontSize: "0.8rem",
                                                }}>
                                                /
                                            </Typography>
                                            <TextField
                                                variant="standard"
                                                value={weeklyValues[index]}
                                                onChange={(e) =>
                                                    handleWeeklyChange(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                inputProps={{
                                                    style: {
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        color: "#3F51B5",
                                                        padding: 0,
                                                    },
                                                    inputMode: "numeric",
                                                    pattern: "[0-9]*",
                                                }}
                                                sx={{
                                                    width: "20px",
                                                    "& .MuiInput-root": {
                                                        fontSize: "0.9rem",
                                                    },
                                                    "& .MuiInput-underline:before":
                                                        {
                                                            borderBottom:
                                                                "1px solid #ddd",
                                                        },
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            color="text.primary"
                                            sx={{
                                                fontSize: "0.9rem",
                                                whiteSpace: "nowrap",
                                                letterSpacing: "-0.5px",
                                            }}>
                                            <span
                                                style={{
                                                    color: "#3B82F6",
                                                    padding: "4px",
                                                }}>
                                                {currentValues[index]}
                                            </span>{" "}
                                            /{" "}
                                            <span
                                                style={{
                                                    color: "#3F51B5",
                                                    padding: "4px",
                                                }}>
                                                {weeklyValues[index]}
                                            </span>
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
}

export default RunningRecord;
