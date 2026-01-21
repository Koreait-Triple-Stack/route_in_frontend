import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Stack } from "@mui/system";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { getBoardByBoardId, updateBoard } from "../../apis/board/boardService";
import { usePrincipalState } from "../../store/usePrincipalState";

function BoardEditPage() {
    const { principal } = usePrincipalState();
    const { type, boardId } = useParams();
    const boardIdNum = Number(boardId);
    const userId = principal?.userId;

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const normalizedType = (type ?? "").toLowerCase();
    const upperType = normalizedType.toUpperCase();

    const isRoutine = normalizedType === "routine";
    const isCourse = normalizedType === "course";

    const [form, setForm] = useState({
        title: "",
        content: "",
        start: "",
        end: "",
        distance: "",
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 기존 게시글 조회
    const {
        data: boardResp,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["getBoardByBoardId", boardIdNum],
        queryFn: () => getBoardByBoardId(boardIdNum),
        enabled: Number.isFinite(boardIdNum) && boardIdNum > 0,
    });
    const boardDetail = boardResp?.data?.data?.data;

    // 조회된 값
    useEffect(() => {
        if (!boardDetail) return;
        setForm({
            title: boardDetail.title ?? "",
            content: boardDetail.content ?? "",
            start: boardDetail.start ?? "",
            end: boardDetail.end ?? "",
            distance: boardDetail.distance ?? "",
        });
    }, [boardDetail]);

    // 수정 mutation
    const updatemutation = useMutation({
        mutationKey: ["updateBoard"],
        mutationFn: (payload) => updateBoard(payload),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ["getBoardListByUserId", userId],
            });
            alert(res?.data?.message ?? "게시물 수정 완료");
            navigate("/board");
        },
        onError: (error) => {
            alert(error);
        },
    });

    const updateOnClickHandler = () => {
        if (!isRoutine && !isCourse) return alert("잘못된 접근입니다.");
        if (!userId) return alert("로그인이 필요합니다.");

        if (
            form.title.trim().length === 0 ||
            form.content.trim().length === 0 ||
            form.start.trim().length === 0 ||
            form.end.trim().length === 0 ||
            form.distance.trim().length === 0
        ) {
            alert("모든 항목을 입력해주세요.");
            return;
        }
        const payload = {
            boardId: boardIdNum,
            userId,
            title: form.title.trim(),
            content: form.content.trim(),
            tags: Array.isArray(boardDetail?.tags) ? boardDetail.tags : [],
            type: upperType,
        };

        updatemutation.mutate(payload);
    };

    if (isLoading) {
        return (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isRoutine && !isCourse) {
        return (
            <Box>
                <Typography variant="h6">잘못된 접근입니다.</Typography>
            </Box>
        );
    }
    return (
        <Stack spacing={2}>
            <Box>
                <Typography sx={{ fontWeight: 800, mb: 0.8, fontSize: 14 }}>
                    제목
                </Typography>
                <TextField
                    fullWidth
                    placeholder="제목을 입력하세요."
                    name="title"
                    value={form.title}
                    onChange={onChangeHandler}
                />
                <Typography sx={{ fontWeight: 800, mb: 0.8, fontSize: 14 }}>
                    내용
                </Typography>
                <TextField
                    fullWidth
                    placeholder="내용을 입력하세요."
                    name="content"
                    value={form.content}
                    onChange={onChangeHandler}
                />
                <Typography sx={{ fontWeight: 800, mb: 0.8, fontSize: 14 }}>
                    출발점
                </Typography>
                <TextField
                    fullWidth
                    placeholder="출발점 입력하세요."
                    name="start"
                    value={form.start}
                    onChange={onChangeHandler}
                />
                <Typography sx={{ fontWeight: 800, mb: 0.8, fontSize: 14 }}>
                    도착점
                </Typography>
                <TextField
                    fullWidth
                    placeholder="도착점을 입력하세요."
                    name="end"
                    value={form.end}
                    onChange={onChangeHandler}
                />
                <Typography sx={{ fontWeight: 800, mb: 0.8, fontSize: 14 }}>
                    거리
                </Typography>
                <TextField
                    fullWidth
                    placeholder="거리를 입력하세요."
                    name="distance"
                    value={form.distance}
                    onChange={onChangeHandler}
                />
                <Button
                    variant="contained"
                    fullWidth
                    onClick={updateOnClickHandler}
                    disabled={updatemutation.isPending}>
                    {updatemutation.isPending ? "수정 중..." : "게시하기"}
                </Button>
            </Box>
        </Stack>
    );
}
export default BoardEditPage;
