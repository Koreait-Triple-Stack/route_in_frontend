import { Avatar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { Box, Grid, Stack } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";

function MenuDrawer({ INITIAL_MESSAGES, setIsMenu, isMenu }) {
    return (
        <Drawer
            anchor="right"
            open={isMenu}
            onClose={() => setIsMenu(false)}
            PaperProps={{
                sx: { width: "100%" },
            }}
        >
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
                {/* 1. 메뉴 헤더 (채팅방 서랍) */}
                <Box sx={{ p: 2, pt: 3 }}>
                    <IconButton edge="start" color="inherit">
                        <ArrowBackIcon onClick={() => setIsMenu(false)} />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        채팅방
                    </Typography>

                    {/* 모아보기 아이콘들 */}
                    <Grid container spacing={2} sx={{ textAlign: "center" }}>
                            <Typography variant="caption" display="block">
                                알림
                            </Typography>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* 2. 대화상대 목록 */}
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

                {/* 3. 하단 푸터 (나가기 / 설정) */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: "#f9f9f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                ></Box>
            </Box>
        </Drawer>
    );
}

export default MenuDrawer;
