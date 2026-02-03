import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate } from "react-router-dom";

export const HEADER_H = 64;

export default function LayoutHeader({ scrollTargetId = "app-scroll" }) {
    const navigate = useNavigate();
    const [hidden, setHidden] = useState(false);
    const lastYRef = useRef(0);
    const tickingRef = useRef(false);

    useEffect(() => {
        const el = document.getElementById(scrollTargetId);

        // ✅ 스크롤 컨테이너 못 찾으면(예: 랜딩에서 레이아웃 다를 때) window로 fallback
        const target = el || window;

        const getY = () => {
            if (target === window) return window.scrollY || 0;
            return target.scrollTop || 0;
        };

        lastYRef.current = getY();

        const onScroll = () => {
            const y = getY();

            if (!tickingRef.current) {
                tickingRef.current = true;
                requestAnimationFrame(() => {
                    const lastY = lastYRef.current;
                    const goingDown = y > lastY;
                    const nearTop = y < 24;

                    if (nearTop) setHidden(false);
                    else setHidden(goingDown);

                    lastYRef.current = y;
                    tickingRef.current = false;
                });
            }
        };

        // ✅ app-scroll이면 target에, window면 window에
        target.addEventListener("scroll", onScroll, { passive: true });
        return () => target.removeEventListener("scroll", onScroll);
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
                transform: hidden ? "translateY(-110%)" : "translateY(0)",
                transition: "transform .22s ease",
                backgroundColor: "#FFF",
                pointerEvents: "none",
            }}>
            <Container
                maxWidth="md"
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

                {/* <Stack direction="row" spacing={1}>
                    <Button
                        variant="text"
                        sx={{
                            fontWeight: 800,
                            color: "#0f172a",
                            "&:hover": {
                                backgroundColor: "rgba(15,23,42,0.06)",
                            },
                        }}
                        onClick={() => navigate("/oauth2/signin")}>
                        로그인
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                            borderRadius: "14px",
                            px: 2,
                            fontWeight: 900,
                            background:
                                "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            boxShadow: "0 14px 30px rgba(37,99,235,0.20)",
                            "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: "0 18px 36px rgba(37,99,235,0.26)",
                            },
                            transition: "all .18s ease",
                        }}
                        onClick={() => navigate("/oauth2/signup")}>
                        시작하기
                    </Button>
                </Stack> */}
            </Container>
        </Box>
    );
}
