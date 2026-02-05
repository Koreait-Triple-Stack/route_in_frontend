import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

function DialogComponent({
    open,
    setOpen,
    title,
    content,
    onClick,
    color = "primary",
    ment = "확인",
}) {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: { borderRadius: 3, p: 0.5 },
            }}>
            <DialogTitle sx={{ fontWeight: 900 }}>{title}</DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.5 }}>
                    {content}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={() => setOpen(false)}
                    color={color}
                    sx={{ borderRadius: 2, py: 1.1, fontWeight: 800 }}>
                    취소
                </Button>

                <Button
                    variant="contained"
                    onClick={() => {
                        onClick();
                        setOpen(false);
                    }}
                    color={color}
                    sx={{ borderRadius: 2, py: 1.1, fontWeight: 900 }}>
                    {ment}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogComponent;
