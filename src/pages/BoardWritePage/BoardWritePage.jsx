import React, { useState } from "react";
import { Box, Stack } from "@mui/system";
import {
    Typography,
    TextField,
    Button,
    Paper,
    ToggleButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBoard } from "../../apis/board/boardService";

function BoardWritePage() {
    const navigate = useNavigate();

    const EXERCISE_TAGS = [
        { label: "가슴" },
        { label: "등" },
        { label: "하체" },
        { label: "어깨" },
        { label: "팔" },
        { label: "복근" },
        { label: "유산소" },
    ];
    const { principal } = usePrincipalState();
    const userId = principal?.userId;

    const queryClient = useQueryClient();

    const { type } = useParams();
    const normalizedType = (type ?? "").toLowerCase();
    const upperType = normalizedType.toUpperCase();

    const isRoutine = normalizedType === "routine";
    const isCourse = normalizedType === "course";

    const [form, setForm] = useState({
        title: "",
        content: "",
        tags: [],
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // 게시물 추가
    const mutation = useMutation({
        mutationKey: ["addBoard"],
        mutationFn: (payload) => addBoard(payload),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ["getBoardListInfinite"],
            });
            alert(res?.status === "success" && res?.message);
            navigate("/board");
        },
        onError: (error) => {
            alert(error);
        },
    });

    // 토글 버튼
    const toggleTag = (tagId) => {
        setForm((prev) => {
            const nextTags = prev.tags.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev.tags, tagId];
            return { ...prev, tags: nextTags };
        });
    };

    const submitOnClickHandler = () => {
        if (!isRoutine && !isCourse) return alert("잘못된 접근입니다.");
        if (!userId) return alert("로그인이 필요합니다.");

        if (
            form.title.trim().length === 0 ||
            form.content.trim().length === 0
        ) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        const payload = {
            title: form.title.trim(),
            content: form.content.trim(),
            userId,
            tags: isRoutine ? form.tags : [],
            type: upperType,
        };
        mutation.mutate(payload);
    };

    const cancelOnClickHandler = () => {
        setForm({ title: "", content: "", tags: [] });
        navigate("/board");
    };

    if (!isRoutine && !isCourse) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h6">잘못된 접근입니다.</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "grey.50",
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 4 },
                display: "flex",
                justifyContent: "center",
            }}>
            <Box sx={{ width: "100%", maxWidth: 560 }}>
                <Box
                    sx={{
                        mb: 2,
                        px: { xs: 0.5, sm: 0 },
                    }}>
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: { xs: 20, sm: 24 },
                            lineHeight: 1.2,
                        }}>
                        {isRoutine ? "루틴 작성" : "코스 작성"}
                    </Typography>
                    <Typography
                        sx={{
                            mt: 0.8,
                            color: "text.secondary",
                            fontWeight: 600,
                            fontSize: { xs: 13, sm: 14 },
                        }}></Typography>
                </Box>

                <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        p: { xs: 2, sm: 3 },
                        bgcolor: "white",
                    }}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography
                                sx={{ fontWeight: 800, mb: 0.8, fontSize: 14 }}>
                                제목
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="제목을 입력하세요."
                                name="title"
                                value={form.title}
                                onChange={onChangeHandler}
                            />
                        </Box>
                        {isRoutine && (
                            <Box>
                                <Stack spacing={1.2}>
                                    <Stack
                                        direction="row"
                                        alignItems="baseline"
                                        justifyContent="space-between">
                                        <Typography
                                            sx={{
                                                fontWeight: 900,
                                                fontSize: 14,
                                            }}>
                                            운동 부위
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: "text.secondary",
                                            }}>
                                            복수 선택 가능
                                        </Typography>
                                    </Stack>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1,
                                        }}>
                                        {EXERCISE_TAGS.map((tag) => {
                                            const tagId = idx + 1;
                                            const selected =
                                                selectedTagIds.includes(
                                                    tag.label,
                                                );
                                            return (
                                                <ToggleButton
                                                    key={tag.label}
                                                    value={tag.label}
                                                    selected={selected}
                                                    onChange={() =>
                                                        toggleTag(tag.label)
                                                    }
                                                    sx={{}}>
                                                    {tag.label}
                                                </ToggleButton>
                                            );
                                        })}
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                        <Box>
                            <Typography
                                sx={{ fontWeight: 800, mb: 0.8, fontSize: 14 }}>
                                내용
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={6}
                                placeholder="내용을 입력하세요."
                                name="content"
                                value={form.content}
                                onChange={onChangeHandler}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                color: "text.secondary",
                                fontSize: 12,
                                fontWeight: 700,
                            }}>
                            <span>{form.content.length}자</span>
                            <span>최소 10자 이상 작성해주세요</span>
                        </Box>

                        {/* 버튼 */}
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={cancelOnClickHandler}
                                disabled={mutation.isPending}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    fontWeight: 900,
                                }}>
                                취소
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={submitOnClickHandler}
                                disabled={mutation.isPending}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    fontWeight: 900,
                                }}>
                                {mutation.isPending ? "게시 중..." : "게시하기"}
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
}

export default BoardWritePage;
