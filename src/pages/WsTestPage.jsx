import React, { useState } from "react";
import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { addNotification } from "../apis/notification/notificationService";

export default function WsTestPage() {
    const [userIdsText, setUserIdsText] = useState("22,23");
    const [message, setMessage] = useState("새 알림 테스트입니다!");
    const [path, setPath] = useState("/notification"); // 예: 알림 눌렀을 때 이동할 경로
    const mutation = useMutation({
        mutationFn: (data) => addNotification(data),
        onSuccess: () => console.log("성공")
    })

    const send = async () => {
        const userIds = userIdsText
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n));

        if (userIds.length === 0) return alert("userId를 최소 1개 입력하세요.");
        if (!message.trim()) return alert("message를 입력하세요.");
        if (!path.trim()) return alert("path를 입력하세요.");

        mutation.mutate({
            userIds, message, path
        })
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" fontWeight={900} gutterBottom>
                WS 알림 전송 테스트 (여러 userId)
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                }}>
                <Stack spacing={2}>
                    <TextField
                        label="userIds (콤마로 구분)"
                        value={userIdsText}
                        onChange={(e) => setUserIdsText(e.target.value)}
                        placeholder="예: 22,23,24"
                        size="small"
                    />

                    <TextField
                        label="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        size="small"
                        multiline
                        minRows={2}
                    />

                    <TextField
                        label="path"
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        placeholder="/board/123"
                        size="small"
                    />

                    <Button
                        variant="contained"
                        onClick={send}>
                        {/* {sending ? "전송중..." : "여러명에게 알림 전송"} */}
                        여러명에게 알림 전송
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
