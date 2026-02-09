import { useState } from "react";
import { Box, Container, Stack } from "@mui/system";
import { Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBoard } from "../../apis/board/boardService";
import { useToastStore } from "../../store/useToastStore";
import RoutineParts from "./RoutineParts";
import CourseDetail from "./CourseDetail";
import DialogComponent from "../../components/DialogComponent";
import { filterTextFieldSx } from "../../constants/design";

function BoardWritePage() {
    const { show } = useToastStore();
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const queryClient = useQueryClient();
    const { type: typeLowerCasse } = useParams();
    const type = typeLowerCasse.toUpperCase();
    const [openSave, setOpenSave] = useState(false);

    const [form, setForm] = useState({
        title: "",
        content: "",
        course: null,
        routines: [],
        parts: [],
    });

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
        mutationFn: (payload) => addBoard(payload),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ["getBoardListInfinite"],
            });
            show(res.message, "success");
            navigate(`/board/detail/${res.data}`);
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

        if (type === "COURSE" && !form.course?.region) {
            show("코스를 작성해 주세요", "error");
            return;
        }

        const payload = {
            title: form.title.trim(),
            content: form.content.trim(),
            userId: principal?.userId,
            tags:
                type === "ROUTINE"
                    ? form.parts
                    : [form.course.region, form.course.distanceM],
            type,
            course: form.course,
            routines: form.routines,
        };
        mutation.mutate(payload);
    };

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
                        py: 2,
                    }}>
                    {type === "ROUTINE" ? "루틴 작성" : "코스 작성"}
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
                        size="small"
                        placeholder="제목을 입력하세요."
                        name="title"
                        value={form.title}
                        onChange={onChangeHandler}
                        sx={filterTextFieldSx}
                    />
                    {type === "ROUTINE" ? (
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
                        variant="outlined"
                        label="내용"
                        minRows={6}
                        placeholder="내용을 입력하세요."
                        name="content"
                        value={form.content}
                        onChange={onChangeHandler}
                        sx={{
                            ...filterTextFieldSx,
                            "& .MuiOutlinedInput-root": {
                                ...filterTextFieldSx[
                                    "& .MuiOutlinedInput-root"
                                ],
                                height: "auto",
                                alignItems: "flex-start",
                                py: 1.2,
                            },
                        }}
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
export default BoardWritePage;
