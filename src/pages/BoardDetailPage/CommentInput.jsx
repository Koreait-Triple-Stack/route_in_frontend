import React, { useState } from "react";
import { Box, Button, TextField, Stack } from "@mui/material";

function CommentInput({ onSubmit, onCancel, placeholder }) {
    const [content, setContent] = useState("");

    const isReply = !!onCancel;

    const inputPlaceholder = placeholder || "댓글을 남겨보세요.";

    const handleSubmit = () => {
        if (!content.trim()) return;
        onSubmit(content);
        setContent("");
    };

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    p: 2,
                    bgcolor: isReply ? "#f9f9f9" : "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    mt: isReply ? 1 : 2,
                    mb: 2,
                }}>
                <TextField
                    fullWidth
                    multiline
                    minRows={isReply ? 2 : 3}
                    placeholder={inputPlaceholder}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ mb: 1 }}
                />
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    {isReply && (
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            size="small">
                            취소
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        disableElevation
                        size="small"
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.dark" },
                            fontWeight: "bold",
                        }}>
                        등록
                    </Button>
                </Stack>
            </Box>
        </>
    );
}

export default CommentInput;
