// 공통 컴포넌트
// src/pages/FollowUserListPage/FollowUserList.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { usePrincipalState } from "../../store/usePrincipalState";

import { Box, Container, Stack } from "@mui/system";
import { Avatar, Divider, Paper, Typography } from "@mui/material";

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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2}>
        {list.length > 0 ? (
          list.map((u) => {
            const profileSrc =
              u?.profileImageUrl ?? u?.profileImg ?? u?.profileUrl ?? undefined;

            return (
              <Paper
                key={u?.userId ?? `${mode}-${idx}`}
                elevation={1}
                onClick={() => {
                  if (!u?.userId) return;
                  navigate(`/user/${u.userId}`);
                }}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  cursor: u?.userId ? "pointer" : "default",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  {/* 왼쪽: 프로필 정보 */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={profileSrc}
                      alt={u?.username ?? "profile"}
                      sx={{ width: 36, height: 36}}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="h6">{u?.username}</Typography>
                      <Typography variant="body2">{u?.gender}</Typography>
                    </Box>
                  </Box>

                  {/* 팔로우/언팔로우 버튼  */}
                  {typeof renderRight === "function" ? (
                    <Box
                      onClick={(e) => e.stopPropagation()}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {renderRight(u)}
                    </Box>
                  ) : null}
                </Box>
              </Paper>
            );
          })
        ) : (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <Typography color="text.secondary">{emptyText}</Typography>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
