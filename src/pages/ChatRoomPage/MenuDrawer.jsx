import {
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import UserAvatarLink from "../../components/UserAvatarLink";
import CloseIcon from "@mui/icons-material/Close";

function MenuDrawer({
    participants,
    setIsMenu,
    isMenu,
    setIsInvite,
    chatAreaRef,
}) {
    return (
        <Drawer
            anchor="right"
            open={isMenu}
            onClose={() => setIsMenu(false)}
            variant="temporary"
            ModalProps={{
                container: () => chatAreaRef.current, // ✅ 여기로 제한
                disablePortal: true, // ✅ body로 안튀어나가게
                keepMounted: true,
                BackdropProps: {
                    sx: {
                        backgroundColor: "transparent", // ✅ 배경 안 어두워짐
                        position: "absolute", // ✅ chatAreaRef 안에서만 덮기
                        inset: 0,
                    },
                },
            }}
            sx={{
                position: "absolute",
                zIndex: 1300,
                "& .MuiDrawer-paper": {
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%",
                    width: "80%",
                    boxSizing: "border-box",
                    borderLeft: "1px solid #ddd",
                },
            }}>
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fff",
                }}>
                <Box
                    sx={{
                        p: 1.5,
                        pl: 2,
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                    }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setIsMenu(false)}>
                        <CloseIcon />
                    </IconButton>

                    <Typography
                        textAlign={"center"}
                        variant="h6"
                        sx={{ fontWeight: "bold", pl: 1 }}>
                        채팅방
                    </Typography>
                </Box>

                <Divider />

                <Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}>
                            대화상대 {participants.length}
                        </Typography>
                        <Button
                            size="medium"
                            sx={{ color: "#555" }}
                            onClick={() => setIsInvite(true)}>
                            초대
                        </Button>
                    </Stack>

                    <List>
                        {participants.map((user) => (
                            <ListItem key={user.userId} disableGutters>
                                <ListItemAvatar>
                                    <UserAvatarLink
                                        src={user.profileImg}
                                        userId={user.userId}
                                        size={48}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.username}
                                    primaryTypographyProps={{
                                        fontWeight: "500",
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Drawer>
    );
}

export default MenuDrawer;
