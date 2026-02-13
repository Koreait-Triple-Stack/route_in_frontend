import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { usePrincipalState } from "../../store/usePrincipalState";

import { Box, Container, Stack } from "@mui/system";
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemButton,
    Typography,
} from "@mui/material";

import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";

export default function FollowUserList({
    title = "",
    queryKeyPrefix,
    queryFn,
    emptyText = "목록이 없습니다.",
    mode,
    renderRight,
}) {
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const { userId: userIdParam } = useParams();

    const targetUserId = useMemo(() => {
        const p = Number(userIdParam);
        if (Number.isFinite(p) && p > 0) return p;
        return principal?.userId;
    }, [userIdParam, principal?.userId]);

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

    const raw = response?.data ?? response;
    const payload = raw?.data ?? raw;
    const list = Array.isArray(payload) ? payload : [];

    if (isLoading) return <Loading />;
    if (isError) return <ErrorComponent error={error} />;

    return (
        <Container>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ pl: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", py: 2 }}>
                    {title}
                </Typography>
            </Stack>

            <Divider sx={{mx:2}}/>

            <List>
                {list.length > 0 ? (
                    list.map((u) => {
                        const profileSrc =
                            u?.profileImageUrl ??
                            u?.profileImg ??
                            u?.profileUrl ??
                            undefined;

                        return (
                            <Box key={u?.userId ?? `${mode}-${idx}`}>
                                <ListItem
                                    disablePadding
                                    disableGutters
                                    onClick={() => {
                                        if (!u?.userId) return;
                                        navigate(`/user/${u.userId}`);
                                    }}
                                >
                                    <ListItemButton
                                        sx={{
                                            py: 2,
                                            borderRadius: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                            }}
                                        >
                                            <Avatar
                                                src={profileSrc}
                                                alt={u?.username ?? "profile"}
                                                sx={{ width: 36, height: 36 }}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                                >
                                                <Typography
                                                    sx={{
                                                        fontSize: 18,
                                                        fontWeight: "550",
                                                    }}>
                                                    {u?.username}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {u?.gender}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {typeof renderRight === "function" ? (
                                            <Box
                                                onPointerDown={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onMouseDown={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onTouchStart={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {renderRight(u)}
                                            </Box>
                                        ) : null}
                                    </ListItemButton>
                                </ListItem>
                                <Divider variant="middle" />
                            </Box>
                        );
                    })
                ) : (
                    <Box sx={{ py: 10, textAlign: "center" }}>
                        <Typography color="text.secondary">
                            {emptyText}
                        </Typography>
                    </Box>
                )}
            </List>
        </Container>
    );
}
