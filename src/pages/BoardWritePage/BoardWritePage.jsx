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
import { addBoardRequest } from "../../apis/board/boardApi";
import { EXERCISE_TAGS } from "../../constants/exerciseTags";

const DAYS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

// 렌더링을 위해 추가
export default function BoardWritePage() {
  const { type } = useParams(); // /board/write/:type

  if (type === "routine") return <RoutineWriteInner />;
  if (type === "running") return <RunningWriteInner />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">잘못된 접근입니다.</Typography>
    </Box>
  );
}


// RoutineWritePage 
function RoutineWriteInner() {
  const navigate = useNavigate();
  const { principal } = usePrincipalState();

  const [title, setTitle] = useState("");
  const [write, setWrite] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);


  // 요일별 운동 목록 저장할 객체
  const [routine, setRoutine] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );

  const titleInputOnChangeHandler = (e) => setTitle(e.target.value);
  const writeInputOnChangeHandler = (e) => setWrite(e.target.value);

  // 운동부위 ToggleButton 
  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // 선택된 tag id -> label 문자열로 변환 (백엔드 List<String> 대응)
  const selectedTagLabels = useMemo(() => {
    return EXERCISE_TAGS.filter((t) => selectedTagIds.includes(t.id)).map(
      (t) => t.label
    );
  }, [selectedTagIds]);

  // 운동 추가 작성
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
      id: Date.now(), // 삭제를 위함
      name: trimmedName,
      exercise: trimmedExercise,
    };

    setRoutine((prev) => ({
      ...prev,
      [day]: [...prev[day], addRoutine],
    }));
  };

  // 운동 삭제
  const handleDeleteExercise = (day, id) => {
    setRoutine((prev) => ({
      ...prev,
      [day]: prev[day].filter((item) => item.id !== id),
    }));
  };

  // 저장(서버 전송)
  const submitOnClickHandler = async () => {

    // 제목 검사
    if (!title.trim()) {
      alert("제목을 작성해 주세요.");
      return;
    }

    // 하나 이상의 루틴 작성 검사
    const hasAnyRoutine = Object.values(routine).some((arr) => arr.length > 0);
    if (!hasAnyRoutine) {
      alert("하나 이상의 루틴을 추가해주세요");
      return;
    }

    // 로그인 검사
    const userId = principal?.userId;
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!window.confirm("게시글을 등록하시겠습니까?")) return;

    // 서버로 보낼 루틴 목록(요일별 운동들)
    const send = Object.entries(routine).flatMap(([day, arr]) =>
      arr.map((info) => ({
        day,
        name: info.name,
        exercise: info.exercise,
      }))
    );

    // 서버로 보낼 요청 데이터
    const data = {
      userId,
      type: "routine",
      title: title.trim(),
      content: write.trim(),
      tags: selectedTagLabels, // label 문자열로 보내기
      send, // 백엔드에서 send 처리 필요(리스트 insert)
    };

    try {
      const response = await addBoardRequest(data);
      const body = response?.data;

      if (body?.status === "success") {
        alert(body?.message ?? "게시물 작성이 완료되었습니다.");
        navigate("/board");
      } else {
        alert(body?.message ?? "저장 실패");
        console.log("addBoard failed response:", body);
      }
    } catch (e) {
      console.error(e);
      alert("서버 요청 실패");
    }
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
          onChange={titleInputOnChangeHandler}
        />

        {/* 운동 부위 */}
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

        {/* 운동 루틴 */}
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
          onChange={writeInputOnChangeHandler}
        />

        <Button variant="contained" onClick={submitOnClickHandler}>
          확인
        </Button>
      </Stack>
    </Box>
  );
}


// RunningWritePage 
function RunningWriteInner() {
  const navigate = useNavigate();
  const { principal } = usePrincipalState();
  const [title, setTitle] = useState("");
  const [write, setWrite] = useState("");

  const titleInputOnChangeHandler = (e) => {
    setTitle(e.target.value);
  };

  const writeInputOnChangeHandler = (e) => {
    setWrite(e.target.value);
  };

  const submitOnClickHandler = async () => {
    const userId = principal?.userId;
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 빈칸 체크
    if (title.trim().length === 0 || write.trim().length === 0) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 서버로 보낼 데이터
    const data = {
      userId,
      type: "running", 
      title: title.trim(),
      content: write.trim(),
      tags: [],
    };

    try {
      const response = await addBoardRequest(data);

      if (response.status === 200 || response.status === 201) {
        alert("게시글이 추가되었습니다.");
        navigate("/board");
        return;
      }

      alert("요청이 실패했습니다.");
    } catch (e) {
      console.error(e);

      const message =
        e?.response?.message ?? e?.message ?? "서버 요청에 실패 했습니다.";

      alert(message);
    }
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
          onChange={titleInputOnChangeHandler}
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
          onChange={writeInputOnChangeHandler}
        />
      </Box>
      <Button onClick={submitOnClickHandler}>확인</Button>
    </Box>
  );
}
