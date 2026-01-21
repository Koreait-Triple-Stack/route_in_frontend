import React from "react";
import { getFollowerUserList } from "../../apis/follow/followService";
import { useQuery } from "@tanstack/react-query";
import { usePrincipalState } from "../../store/usePrincipalState";
import { Box, Container, Stack } from "@mui/system";
import { Chip, Divider, Paper, Typography } from "@mui/material";

function FollowerListPage() {
    const { principal } = usePrincipalState();
    const { data: response, isLoading } = useQuery({
        queryKey: ["getFollowerUserList", principal?.userId],
        queryFn: () => getFollowerUserList(principal?.userId),
        staleTime: 30000,
    });

    const respData = response?.data;

    if (isLoading) return <div>로딩중...</div>;

    return (
        <Container>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    FollowerList
                </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
                {respData.length > 0 ? (
                    respData.map((f) => (
                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                cursor: "pointer",
                                transition: "all 0.2s ease",

                                "&:hover": {
                                    elevation: 4,
                                    backgroundColor: "action.hover",
                                    transform: "translateY(-2px)",
                                },

                                "&:active": {
                                    transform: "scale(0.98)",
                                },
                            }}
                            key={f.followId}
                        >
                            <Stack spacing={1.5}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src="https://firebasestorage.googleapis.com/v0/b/board-study-26e00.firebasestorage.app/o/profile-img%2F40aaf171-5eae-4e81-96af-a89730616960_jpeg?alt=media&token=86b09376-18b3-49a9-881d-2b5ae5a728eb"
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="h6">{f?.username}</Typography>
                                        <Typography variant="body2">
                                            {f?.gender}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>
                    ))
                ) : (
                    <Box sx={{ py: 10, textAlign: "center" }}>
                        <Typography color="text.secondary">Follower가 없습니다.</Typography>
                    </Box>
                )}
            </Stack>
        </Container>
    );
}

export default FollowerListPage;
