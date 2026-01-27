import { Avatar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Box, Grid, Stack } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";

function MenuDrawer({ INITIAL_MESSAGES, setIsMenu, isMenu }) {
    return (
        <>
            {isMenu && (
                <Box
                    onClick={() => setIsMenu(false)} 
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)", 
                        zIndex: 1200, // Drawer 바로 아래
                        cursor: "pointer",
                    }}
                />
            )}

            {/* 📂 2. Drawer 본체 */}
            <Drawer
                anchor="right"
                open={isMenu}
                onClose={() => setIsMenu(false)}
                // 🔥 핵심: temporary 대신 persistent 사용
                // 이렇게 하면 MUI가 body 스크롤을 막거나 aria-hidden을 걸지 않습니다.
                variant="persistent"
                sx={{
                    // Drawer의 최상위 루트 (위치 잡기용)
                    "& .MuiDrawer-root": {
                        position: "absolute",
                        zIndex: 1300, // 배경(1200)보다 높게
                        right: 0,
                        top: 0,
                        height: "100%",
                    },
                    // 실제 하얀 종이 부분
                    "& .MuiDrawer-paper": {
                        position: "absolute", // fixed 제거
                        width: "80%", // 너비
                        height: "100%", // 높이
                        boxSizing: "border-box",
                        borderLeft: "1px solid #ddd", // 경계선 추가 (선택사항)
                    },
                }}
            >
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
                    <Box sx={{ p: 2, pt: 3 }}>
                        <IconButton edge="start" color="inherit">
                            <ArrowBackIcon onClick={() => setIsMenu(false)} />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            채팅방
                        </Typography>

                        <Grid container spacing={2} sx={{ textAlign: "center" }}>
                            <Typography variant="caption" display="block">
                                알림
                            </Typography>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                대화상대 2
                            </Typography>
                            <Button size="small" sx={{ color: "#555" }}>
                                초대
                            </Button>
                        </Stack>

                        <List>
                            {INITIAL_MESSAGES.map((user) => (
                                <ListItem key={user.id} disableGutters>
                                    <ListItemAvatar>
                                        <Avatar src={user.profile} />
                                    </ListItemAvatar>
                                    <ListItemText primary={user.sender} primaryTypographyProps={{ fontWeight: "500" }} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}

export default MenuDrawer;
