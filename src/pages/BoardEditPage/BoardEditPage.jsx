import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Container, Stack } from "@mui/system";
import { Button, TextField, ToggleButton, Typography } from "@mui/material";
import { updateBoard } from "../../apis/board/boardService";
import { usePrincipalState } from "../../store/usePrincipalState";
import { EXERCISE_PARTS } from "../../constants/exerciseParts";

function BoardEditPage() {
  const location = useLocation();
  const { boardData } = location.state || {};
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { principal } = usePrincipalState();
  const userId = principal?.userId;

  const typeUpper = String(boardData?.type ?? "").toUpperCase();
  const isRoutine = typeUpper.includes("ROUTINE");
  const isValidType = Boolean(typeUpper);

  const normalizeTags = (tags) => {
    if (Array.isArray(tags)) return tags;

    if (typeof tags === "string") {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

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
      tags: normalizeTags(boardData.tags),
    });
  }, [boardData]);

  const toggleParts = useMemo(() => {
    return Array.from(
      new Set([...(EXERCISE_PARTS ?? []), ...(form.tags ?? [])]),
    );
  }, [form.tags]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (part) => {
    setForm((prev) => {
      const nextTags = prev.tags.includes(part)
        ? prev.tags.filter((t) => t !== part)
        : [...prev.tags, part];
      return { ...prev, tags: nextTags };
    });
  };

  const updatemutation = useMutation({
    mutationKey: ["updateBoard", boardData?.boardId],
    mutationFn: (payload) => updateBoard(payload),
    onSuccess: (res) => {
      alert(res?.message ?? "게시물 수정 완료");

      queryClient.invalidateQueries({
        queryKey: ["getBoardListByUserId", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["getBoardListInfinite"] });
      queryClient.invalidateQueries({
        queryKey: ["getBoardByBoardId", boardData?.boardId],
      });

      navigate(`/board/detail/${boardData.boardId}`, { replace: true });
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

    const title = form.title.trim();
    const content = form.content.trim();

    if (title.length === 0 || content.length === 0) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const payload = {
      userId,
      boardId: boardData.boardId,
      title,
      content,

      tags: isRoutine ? form.tags : [],
      type: typeUpper,
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
    <Container maxWidth="sm" sx={{ py: 2 }}>
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

        {/* ✅ 루틴 글이면 태그 버튼 영역 무조건 표시 */}
        {isRoutine && (
          <Box>
            <Stack spacing={1.2}>
              <Stack
                direction="row"
                alignItems="baseline"
                justifyContent="space-between"
              >
                <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                  운동 부위
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  복수 선택 가능
                </Typography>
              </Stack>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {toggleParts.map((part) => (
                  <ToggleButton
                    key={part}
                    value={part}
                    selected={form.tags.includes(part)}
                    onClick={() => toggleTag(part)}
                    sx={{
                      borderRadius: 999,
                      px: 1.5,
                      py: 0.7,
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    {part}
                  </ToggleButton>
                ))}
              </Box>
            </Stack>
          </Box>
        )}

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

        <Button
          variant="contained"
          fullWidth
          onClick={updateOnClickHandler}
          disabled={updatemutation.isPending}
          sx={{ borderRadius: 2, py: 1.2, fontWeight: 900 }}
        >
          {updatemutation.isPending ? "수정 중..." : "수정하기"}
        </Button>
      </Stack>
    </Container>
  );
}

export default BoardEditPage;
