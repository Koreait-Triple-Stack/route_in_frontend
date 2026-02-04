import React, { useEffect, useRef, useState } from "react";
import {
    Badge,
    Box,
    Container,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { countUnreadNotificationByUserId } from "../apis/notification/notificationService";
import { useQuery } from "@tanstack/react-query";
import { usePrincipalState } from "../store/usePrincipalState";

export const HEADER_H = 64;

export default function LayoutHeader({ scrollTargetId = "app-scroll" }) {
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const [offset, setOffset] = useState(0);
    const rafRef = useRef(null);

    const { data: notificationResp } = useQuery({
        queryFn: () => countUnreadNotificationByUserId(principal.userId),
        queryKey: ["countUnreadNotificationByUserId", principal?.userId],
        enabled: !!principal?.userId,
    });

    useEffect(() => {
        const el = document.getElementById(scrollTargetId);
        const target = el || window;

        const getY = () => {
            if (target === window) return window.scrollY || 0;
            return target.scrollTop || 0;
        };

        const apply = () => {
            const y = getY();
            const clamped = Math.max(0, Math.min(HEADER_H, y));
            setOffset(clamped);

            if (el) {
                el.style.setProperty(
                    "--header-offset",
                    `${HEADER_H - clamped}px`,
                );
            }
            rafRef.current = null;
        };

        const onScroll = () => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(apply);
        };

        apply();

        target.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            target.removeEventListener("scroll", onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [scrollTargetId]);

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: HEADER_H,
                zIndex: 1300,
                transform: `translateY(-${offset}px)`,
                transition: "transform 0s",
                backgroundColor: "#FFF",
                pointerEvents: "none",
                borderBottom: "1px solid",
                borderColor: "divider",
            }}>
            <Container
                maxWidth="sm"
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pointerEvents: "auto",
                }}>
                <Stack
                    onClick={() => navigate("/main")}
                    direction="row"
                    spacing={1.1}
                    alignItems="center"
                    sx={{ cursor: "pointer" }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            background:
                                "linear-gradient(135deg, #2563eb, #22c55e)",
                            boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
                        }}>
                        <DirectionsRunRoundedIcon sx={{ color: "#fff" }} />
                    </Box>
                    <Typography
                        sx={{
                            fontWeight: 900,
                            letterSpacing: -0.2,
                            color: "#0f172a",
                        }}>
                        Route In
                    </Typography>
                </Stack>

                <IconButton onClick={() => navigate("/notification")}>
                    <Badge badgeContent={notificationResp?.data} color="error">
                        <FiBell />
                    </Badge>
                </IconButton>
            </Container>
        </Box>
    );
}
