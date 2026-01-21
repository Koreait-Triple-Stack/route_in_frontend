import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Container, Stack } from "@mui/system";
import { Button, TextField, Typography } from "@mui/material";
import { updateBoard } from "../../apis/board/boardService";
import { usePrincipalState } from "../../store/usePrincipalState";

function BoardEditPage() {
  const location = useLocation();
  const { boardData } = location.state || {};

  const { principal } = usePrincipalState();
  const userId = principal?.userId;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: [],
  });

  useEffect(() => {
    if (!boardData) return;
    setForm({
      title: boardData.title ?? "",
      content: boardData.content ?? "",
      tags: boardData.tags ?? [],
    });
  }, [boardData]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizedType = (boardData?.type ?? "").toLowerCase();
  const upperType = normalizedType.toUpperCase();
  const isValidType =
    normalizedType === "routine" || normalizedType === "course";

  const updatemutation = useMutation({
    mutationKey: ["updateBoard", boardData?.boardId],
    mutationFn: updateBoard,
    onSuccess: (res) => {
      alert(res?.message ?? "게시물 수정 완료");

      queryClient.invalidateQueries({
        queryKey: ["getBoardListByUserId", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["getBoardListInfinite"] });
      queryClient.invalidateQueries({
        queryKey: ["getBoardByBoardId", boardData?.boardId],
      });

      navigate("/board/edit");
    },
    onError: (error) => {
      alert(error?.message ?? "수정 실패");
    },
  });

  const updateOnClickHandler = () => {
    if (!boardData) return alert("게시글 데이터를 전달받지 못했습니다.");
    if (!userId) return alert("로그인이 필요합니다.");
    if (!isValidType) return alert("잘못된 접근입니다.");
    if (!window.confirm("정말로 게시물을 수정하시겠습니까?")) return;

    if (form.title.trim().length === 0 || form.content.trim().length === 0) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const payload = {
      userId,
      boardId: boardData.boardId,
      title: form.title.trim(),
      content: form.content.trim(),
      tags: Array.isArray(boardData?.tags) ? boardData.tags : [],
      type: upperType,
    };

    updatemutation.mutate(payload);
  };

  if (!boardData) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6">
          게시글 데이터를 전달받지 못했습니다. (새로고침하면 편집이 불가합니다)
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 56,
        display: "flex",
        justifyContent: "center",
        px: 2,
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 500 }}>
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
          </Box>

          <Box>
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
          </Box>

          <Box>
            <Button
              variant="contained"
              fullWidth
              onClick={updateOnClickHandler}
              disabled={updatemutation.isPending}
            >
              {updatemutation.isPending ? "수정 중..." : "수정하기"}
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default BoardEditPage;
