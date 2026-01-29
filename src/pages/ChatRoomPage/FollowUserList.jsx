import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Stack } from "@mui/system";
import { Avatar, Paper, Typography, Checkbox } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function FollowUserList({
    queryKeyPrefix,
    queryFn,
    emptyText = "목록이 없습니다.",
    mode,
    selectedIds,
    setSelectedIds,
    participantIds,
}) {
    const { principal } = usePrincipalState();

    const targetUserId = useMemo(() => {
        return principal?.userId;
    }, [principal?.userId]);

    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [queryKeyPrefix, targetUserId],
        queryFn: () => queryFn(targetUserId),
        enabled: !!targetUserId && typeof queryFn === "function",
        staleTime: 30000,
        gcTime: 10 * 60000,
    });

    const handleToggle = (user) => {
        setSelectedIds((prev) => {
            if (prev.includes(user.userId)) {
                return prev.filter((i) => i !== user.userId);
            } else {
                return [...prev, user.userId];
            }
        });
    };

    const raw = response?.data ?? response;
    const payload = raw?.data ?? raw;
    const list = payload?.filter((p) => !participantIds.has(Number(p.userId)));

    if (isLoading) return <Loading />;
    if (isError) return <ErrorComponent error={error} />;

    return (
        <Container>
            <Stack spacing={2}>
                {list.length > 0 ? (
                    list.map((u, idx) => {
                        const profileSrc =
                            u?.profileImageUrl ??
                            u?.profileImg ??
                            u?.profileUrl ??
                            undefined;
                        const isSelected = selectedIds.includes(u?.userId);

                        return (
                            <Paper
                                key={u?.userId ?? `${mode}-${idx}`}
                                elevation={1}
                                onClick={() => {
                                    if (u?.userId) handleToggle(u);
                                }}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    cursor: u?.userId ? "pointer" : "default",
                                    transition: "all 0.2s ease",
                                    backgroundColor: isSelected
                                        ? "rgba(0, 0, 0, 0.04)"
                                        : "#fff",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                        boxShadow: 4,
                                    },
                                    "&:active": {
                                        transform: "scale(0.98)",
                                    },
                                }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 2,
                                    }}>
                                    {/* 왼쪽: 프로필 정보 */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}>
                                        <Avatar
                                            src={profileSrc}
                                            alt={u?.username ?? "profile"}
                                            sx={{ width: 36, height: 36 }}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}>
                                            <Typography variant="h6">
                                                {u?.username}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* 오른쪽: 카카오톡 스타일 체크박스 */}
                                    <Checkbox
                                        checked={isSelected}
                                        sx={{ pointerEvents: "none" }}
                                        icon={
                                            <RadioButtonUncheckedIcon
                                                sx={{
                                                    color: "#ddd",
                                                }}
                                            />
                                        }
                                        checkedIcon={
                                            <Box
                                                sx={{
                                                    backgroundColor: "#7a7676",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "1.5rem",
                                                    height: "1.5rem",
                                                }}>
                                                <CheckCircleIcon
                                                    sx={{
                                                        color: "#a9dba9",
                                                        fontSize: "1.5rem",
                                                    }}
                                                />
                                            </Box>
                                        }
                                    />
                                </Box>
                            </Paper>
                        );
                    })
                ) : (
                    <Box sx={{ py: 10, textAlign: "center" }}>
                        <Typography color="text.secondary">
                            {emptyText}
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Container>
    );
}

export default FollowUserList;
