import React, { useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/system";
import { Typography, TextField, Button, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBoard } from "../../apis/board/boardService";
import { useToastStore } from "../../store/useToastStore";
import RoutineParts from "./RoutineParts";
import CourseDetail from "./CourseDetail";
import DialogComponent from "../../components/DialogComponent";
import Loading from "../../components/Loading";

function BoardEditPage() {
    const { show } = useToastStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();
    const { boardData } = location.state ?? {};
    const [openSave, setOpenSave] = useState(false);

    const [form, setForm] = useState({
        title: "",
        content: "",
        course: null,
        routines: [],
        parts: [],
    });

    useEffect(() => {
        if (!boardData) return;
        setForm(boardData);
        if (boardData.type === "ROUTINE") {
            setForm((prev) => ({
                ...prev,
                parts: boardData.tags,
            }));
        }
    }, [boardData]);

    const setCourse = (course) => {
        setForm((prev) => ({
            ...prev,
            course: course,
        }));
    };

    const setRoutine = (day, localRoutine) => {
        setForm((prev) => {
            const otherRoutines = prev.routines.filter(
                (r) => r.weekday !== day,
            );

            return {
                ...prev,
                routines: [...otherRoutines, ...localRoutine],
            };
        });
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const mutation = useMutation({
        mutationFn: (payload) => updateBoard(payload),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ["getBoardListInfinite"],
            });
            show(res.message, "success");
            navigate(`/board/detail/${form.boardId}`);
        },
        onError: (res) => {
            show(res.message, "error");
        },
    });

    const submitOnClickHandler = () => {
        if (
            form.title.trim().length === 0 ||
            form.content.trim().length === 0
        ) {
            show("모든 항목을 입력해주세요.", "error");
            return;
        }

        const payload = {
            boardId: form.boardId,
            userId: form.userId,
            title: form.title.trim(),
            content: form.content.trim(),
            tags:
                boardData.type === "ROUTINE"
                    ? form.parts
                    : [form.course.region, form.course.distanceM],
            type: form.type,
            course: form.course,
            routines: form.routines,
        };
        mutation.mutate(payload);
    };

    if (!boardData) return <Loading />;

    return (
        <Container>
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
                    {boardData?.type === "ROUTINE" ? "루틴 작성" : "코스 작성"}
                </Typography>
                <Typography
                    sx={{
                        mt: 0.8,
                        color: "text.secondary",
                        fontWeight: 600,
                        fontSize: { xs: 13, sm: 14 },
                    }}></Typography>
            </Box>

            <Box>
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="제목"
                        placeholder="제목을 입력하세요."
                        name="title"
                        value={form.title}
                        onChange={onChangeHandler}
                    />
                    {boardData?.type === "ROUTINE" ? (
                        <RoutineParts
                            form={form}
                            setForm={setForm}
                            setRoutine={setRoutine}
                        />
                    ) : (
                        <CourseDetail
                            course={form.course}
                            setCourse={setCourse}
                        />
                    )}

                    <TextField
                        fullWidth
                        multiline
                        minRows={6}
                        variant="outlined"
                        label="내용"
                        placeholder="내용을 입력하세요."
                        name="content"
                        value={form.content}
                        onChange={onChangeHandler}
                    />

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate("/board")}
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
                            onClick={() => setOpenSave(true)}
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
            </Box>

            <DialogComponent
                open={openSave}
                setOpen={setOpenSave}
                title={"저장"}
                content={"게시글을 저장하시겠습니까?"}
                onClick={submitOnClickHandler}
            />
        </Container>
    );
}

export default BoardEditPage;
