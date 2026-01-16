import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import { EXERCISE_TAGS } from "../../constants/exerciseTags";
import { useMutation } from "@tanstack/react-query";
import { addBoardRequest } from "../../apis/board/boardApi";

const DAYS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

// BoardWritePage
export default function BoardWritePage() {
  const { type } = useParams(); // /board/write/:type

  if (type === "routine") return <RoutineWritePage />;
  if (type === "running") return <RunningWritePage />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">잘못된 접근입니다.</Typography>
    </Box>
  );
}

// RoutineWritePage
function RoutineWritePage() {
  const navigate = useNavigate();
  const { principal } = usePrincipalState();
  const userId = principal?.userId;

  const [title, setTitle] = useState("");
  const [write, setWrite] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const [routine, setRoutine] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );

  const mutation = useMutation({
    mutationKey: ["addBoard"],
    mutationFn: addBoardRequest,
    onSuccess: (res) => {
      alert(res?.data?.message ?? "등록 완료");
      navigate("/board");
    },
    onError: (err) => {
      alert(err?.response?.data?.message ?? err?.message ?? "요청 실패");
    },
  });

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const selectedTagLabels = useMemo(() => {
    return EXERCISE_TAGS.filter((t) => selectedTagIds.includes(t.id)).map(
      (t) => t.label
    );
  }, [selectedTagIds]);

  const handleOpenForm = (day) => {
    const name = window.prompt("운동 이름");
    if (name === null) return;

    const trimmedName = name.trim();
    if (!trimmedName) return;

    const exercise = window.prompt("세트 x 횟수 (예: 3 x 10)");
    if (exercise === null) return;

    const trimmedExercise = exercise.trim();
    if (!trimmedExercise) return;

    const addRoutine = {
      id: Date.now(),
      name: trimmedName,
      exercise: trimmedExercise,
    };

    setRoutine((prev) => ({
      ...prev,
      [day]: [...prev[day], addRoutine],
    }));
  };

  const handleDeleteExercise = (day, id) => {
    setRoutine((prev) => ({
      ...prev,
      [day]: prev[day].filter((item) => item.id !== id),
    }));
  };

  const submitOnClickHandler = () => {
    if (userId == null) return alert("로그인이 필요합니다.");

    if (!title.trim()) return alert("제목을 작성해 주세요.");

    const hasAnyRoutine = Object.values(routine).some((arr) => arr.length > 0);
    if (!hasAnyRoutine) return alert("하나 이상의 루틴을 추가해주세요");

    if (!window.confirm("게시글을 등록하시겠습니까?")) return;

    const send = Object.entries(routine).flatMap(([day, arr]) =>
      arr.map((item) => ({
        day,
        name: item.name,
        exercise: item.exercise,
      }))
    );

    const payload = {
      userId,
      type: "routine",
      title: title.trim(),
      content: write.trim(),
      tags: selectedTagLabels,
      send,
    };

    mutation.mutate(payload);
  };

  return (
    <Box>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
        <TextField
          id="title"
          name="title"
          label="제목"
          placeholder="제목을 입력하세요."
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Typography sx={{ fontWeight: "bold" }}>운동 부위</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {EXERCISE_TAGS.map((tag) => (
            <ToggleButton
              key={tag.id}
              value={tag.id}
              selected={selectedTagIds.includes(tag.id)}
              onChange={() => toggleTag(tag.id)}
              sx={{ borderRadius: 999, px: 2 }}
            >
              {tag.label}
            </ToggleButton>
          ))}
        </Box>

        <Divider />

        <Typography sx={{ fontWeight: "bold" }}>운동 루틴</Typography>

        <Stack spacing={2}>
          {DAYS.map((day) => (
            <Box key={day}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>{day}</Typography>
                <Button variant="outlined" onClick={() => handleOpenForm(day)}>
                  운동 추가
                </Button>
              </Box>

              {routine[day].length === 0 ? (
                <Typography sx={{ mt: 1 }} color="text.secondary">
                  운동을 추가해주세요
                </Typography>
              ) : (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {routine[day].map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography>
                        {item.name} / {item.exercise}
                      </Typography>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleDeleteExercise(day, item.id)}
                      >
                        삭제
                      </Button>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          ))}
        </Stack>

        <TextField
          id="write"
          name="write"
          label="글쓰기"
          placeholder="내용입력"
          fullWidth
          multiline
          minRows={4}
          value={write}
          onChange={(e) => setWrite(e.target.value)}
        />

        <Button variant="contained" onClick={submitOnClickHandler}>
          {mutation.isPending ? "저장 중.." : "확인"}
        </Button>
      </Stack>
    </Box>
  );
}

// RunningWritePage
function RunningWritePage() {
  const navigate = useNavigate();
  const { principal } = usePrincipalState();
  const userId = principal?.userId;

  const [title, setTitle] = useState("");
  const [write, setWrite] = useState("");

  const mutation = useMutation({
    mutationKey: ["addBoard"],
    mutationFn: (data) => addBoardRequest(data),
    onSuccess: (response) => {
      alert(response?.data?.message ?? "등록 완료");
      navigate("/board");
    },
    onError: (error) => {
      alert(error?.response?.data?.message ?? error?.message ?? "요청 실패");
    }, 
  });

  const submitOnClickHandler = () => {
    if (userId == null) return alert("로그인이 필요합니다.");

    if (!title.trim() || !write.trim())
      return alert("모든 항목을 입력해주세요.");

    const payload = {
      userId,
      type: "running",
      title: title.trim(),
      content: write.trim(),
      tags: [],
    };

    mutation.mutate(payload);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "white",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
        <TextField
          id="title"
          name="title"
          label="제목"
          type="text"
          placeholder="제목을 입력하세요."
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Stack>

      <Typography>코스 지도</Typography>
      <Box
        sx={{
          width: "100%",
          height: 180,
          bgcolor: "#e9ecef",
          mb: 2,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        지도 미리보기 영역
      </Box>

      <Divider />

      <Box sx={{}}>
        코스정보
        <TextField
          id="write"
          name="write"
          label="글쓰기"
          type="text"
          placeholder="내용입력"
          fullWidth
          variant="outlined"
          value={write}
          onChange={(e) => setWrite(e.target.value)}
        />
      </Box>

      <Button onClick={submitOnClickHandler}>확인</Button>
    </Box>
  );
}
