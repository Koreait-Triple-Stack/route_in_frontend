import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/system";
import {
    Avatar,
    Typography,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    Divider,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function FollowUserList({
    queryKeyPrefix,
    queryFn,
    emptyText = "목록이 없습니다.",
    mode,
    selectedIds,
    setSelectedIds,
    setUsernames,
}) {
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

    const handleToggle = (user) => {
        setSelectedIds((prev) => {
            if (prev.includes(user.userId)) {
                return prev.filter((i) => i !== user.userId);
            } else {
                return [...prev, user.userId];
            }
        });
        setUsernames((prev) => {
            if (prev.includes(user.username)) {
                return prev.filter((i) => i !== user.username);
            } else {
                return [...prev, user.username];
            }
        });
    };

    const raw = response?.data ?? response;
    const payload = raw?.data ?? raw;
    const list = Array.isArray(payload) ? payload : [];

    if (isLoading) return <Loading />;
    if (isError) return <ErrorComponent error={error} />;

    return (
        <List>
            {list.length > 0 ? (
                list.map((u, idx) => {
                    const profileSrc =
                        u?.profileImageUrl ??
                        u?.profileImg ??
                        u?.profileUrl ??
                        undefined;
                    const isSelected = selectedIds.includes(u?.userId);

                    return (
                        <Box key={u?.userId}>
                            <ListItem key={u?.userId ?? `${mode}-${idx}`}>
                                <ListItemButton
                                    onClick={() => {
                                        if (u?.userId) handleToggle(u);
                                    }}
                                    sx={{
                                        borderRadius: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 2,
                                    }}>
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
                                            <Typography sx={{ fontSize: 18, fontWeight: 550 }}>
                                                {u?.username}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Checkbox
                                        checked={isSelected}
                                        sx={{ pointerEvents: "none" }}
                                        icon={
                                            <RadioButtonUncheckedIcon
                                                sx={{
                                                    color: "#ddd",
                                                    fontSize: "1.5rem",
                                                }}
                                            />
                                        }
                                        checkedIcon={
                                            <CheckCircleIcon
                                                sx={{
                                                    color: "primary.main",
                                                }}
                                            />
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider variant="middle" component="li" />
                        </Box>
                    );
                })
            ) : (
                <Box sx={{ py: 10, textAlign: "center" }}>
                    <Typography color="text.secondary">{emptyText}</Typography>
                </Box>
            )}
        </List>
    );
}

export default FollowUserList;
