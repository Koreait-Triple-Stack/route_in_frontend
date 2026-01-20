import React, { useState } from "react";
import { Box, Stack } from "@mui/system";
import { Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBoardRequest } from "../../apis/board/boardApi";

function BoardWritePage() {
  const navigate = useNavigate();

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
    mutationFn: (payload) => addBoardRequest(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["getBoardListByUserId", userId],
      });
      alert(res?.data?.message ?? "게시물 작성 완료");
      navigate("/board");
    },
    onError: (error) => {
      alert(error);
    },
  });

  const submitOnClickHandler = () => {
    if (!isRoutine && !isCourse) return alert("잘못된 접근입니다.");
    if (!userId) return alert("로그인이 필요합니다.");

    if (form.title.trim().length === 0 || form.content.trim().length === 0) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      userId,
      type: upperType,
    };
    mutation.mutate(payload);
  };

  const cancelOnClickHandler = () => {
    setForm({ title: "", content: "" });
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
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 560 }}>
        <Box
          sx={{
            mb: 2,
            px: { xs: 0.5, sm: 0 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: 20, sm: 24 },
              lineHeight: 1.2,
            }}
          >
            {isRoutine ? "루틴 작성" : "코스 작성"}
          </Typography>
          <Typography
            sx={{
              mt: 0.8,
              color: "text.secondary",
              fontWeight: 600,
              fontSize: { xs: 13, sm: 14 },
            }}
          ></Typography>
        </Box>

        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            bgcolor: "white",
          }}
        >
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
              }}
            >
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
                sx={{ borderRadius: 2, py: 1.2, fontWeight: 900 }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={submitOnClickHandler}
                disabled={mutation.isPending}
                sx={{ borderRadius: 2, py: 1.2, fontWeight: 900 }}
              >
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
