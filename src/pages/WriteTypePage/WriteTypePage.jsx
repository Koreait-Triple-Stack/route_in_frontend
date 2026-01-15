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

const normalizeType = (t) => {
  if (t === "routine") return "routine";
  if (t === "running") return "running";
  return null;
};

const makeEmptyRoutine = () =>
  DAYS.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});

export default function BoardWritePage() {
  const navigate = useNavigate();
  const { type: typeParam } = useParams();
  const type = normalizeType(typeParam);

  const { principal } = usePrincipalState();

  // 공통 입력
  const [title, setTitle] = useState("");
  const [write, setWrite] = useState("");

  // routine 전용
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [routine, setRoutine] = useState(makeEmptyRoutine); // lazy init

  const titleInputOnChangeHandler = (e) => setTitle(e.target.value);
  const writeInputOnChangeHandler = (e) => setWrite(e.target.value);

  // routine: 운동부위 ToggleButton 토글
  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // routine: 선택된 tag id -> label 문자열로 변환 (백엔드 List<String> 대응)
  const selectedTagLabels = useMemo(() => {
    return EXERCISE_TAGS.filter((t) => selectedTagIds.includes(t.id)).map(
      (t) => t.label
    );
  }, [selectedTagIds]);

  // routine: 운동 추가 작성 (prompt 방식 그대로 유지)
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

  // routine: 운동 삭제
  const handleDeleteExercise = (day, id) => {
    setRoutine((prev) => ({
      ...prev,
      [day]: prev[day].filter((item) => item.id !== id),
    }));
  };

  // routine: 서버로 보낼 루틴 목록(요일별 운동들)
  const buildRoutineSend = () => {
    return Object.entries(routine).flatMap(([day, arr]) =>
      arr.map((info) => ({
        day,
        name: info.name,
        exercise: info.exercise,
      }))
    );
  };

  // 응답 성공 판별(기존 2페이지 스타일 모두 대응)
  const isSuccess = (response) => {
    const statusOk = response?.status === 200 || response?.status === 201;
    const bodyOk = response?.data?.status === "success";
    return statusOk || bodyOk;
  };

  // 저장(서버 전송) - 공통 submit
  const submitOnClickHandler = async () => {
    // type 방어
    if (!type) {
      alert("잘못된 접근입니다.");
      return;
    }

    // 로그인 검사
    const userId = principal?.userId;
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 제목 검사(둘 다 동일)
    if (!title.trim()) {
      alert("제목을 작성해 주세요.");
      return;
    }

    // type별 검사
    if (type === "routine") {
      // 하나 이상의 루틴 작성 검사
      const hasAnyRoutine = Object.values(routine).some(
        (arr) => arr.length > 0
      );
      if (!hasAnyRoutine) {
        alert("하나 이상의 루틴을 추가해주세요");
        return;
      }
      // routine은 write(내용) 필수로 안 잡았으니 기존대로 유지(원하면 필수로 바꿀 수 있음)
    }

    if (type === "running") {
      // running은 기존 RunningWritePage처럼 title/write 둘 다 필수
      if (write.trim().length === 0) {
        alert("모든 항목을 입력해주세요.");
        return;
      }
    }

    if (!window.confirm("게시글을 등록하시겠습니까?")) return;

    // type별 payload 구성
    let data;
    if (type === "routine") {
      data = {
        userId,
        type: "routine",
        title: title.trim(),
        content: write.trim(),
        tags: selectedTagLabels,
        send: buildRoutineSend(), // 백엔드에서 send 처리 필요(리스트 insert)
      };
    } else {
      data = {
        userId,
        type: "running", // 기존 코드에 type:"" 비어있던 부분 채움
        title: title.trim(),
        content: write.trim(),
        tags: [],
      };
    }

    try {
      const response = await addBoardRequest(data);

      if (isSuccess(response)) {
        const msg =
          response?.data?.message ??
          (type === "routine"
            ? "게시물 작성이 완료되었습니다."
            : "게시글이 추가되었습니다.");
        alert(msg);
        navigate("/board");
        return;
      }

      alert(response?.data?.message ?? "저장 실패");
      console.log("addBoard failed response:", response?.data);
    } catch (e) {
      console.error(e);
      const message =
        e?.response?.data?.message ??
        e?.response?.message ??
        e?.message ??
        "서버 요청 실패";
      alert(message);
    }
  };

  // 잘못된 type 접근 처리
  if (!type) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">잘못된 접근입니다.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate(-1)}>
          뒤로가기
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "white",
        p: 2,
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
        {/* 공통: 제목 */}
        <TextField
          id="title"
          name="title"
          label="제목"
          placeholder="제목을 입력하세요."
          fullWidth
          value={title}
          onChange={titleInputOnChangeHandler}
        />

        {/* routine 전용 UI */}
        {type === "routine" && (
          <>
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
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenForm(day)}
                    >
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
          </>
        )}
      </Stack>

      {/* running 전용 UI */}
      {type === "running" && (
        <>
          <Typography sx={{ mt: 2 }}>코스 지도</Typography>
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
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>코스정보</Typography>
          </Box>
        </>
      )}

      {/* 공통: 내용 */}
      <Box sx={{ mt: 2, width: "100%", maxWidth: 500 }}>
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
      </Box>

      {/* 공통: 등록 버튼 */}
      <Box sx={{ width: "100%", maxWidth: 500, mt: 2 }}>
        <Button variant="contained" fullWidth onClick={submitOnClickHandler}>
          확인
        </Button>
      </Box>
    </Box>
  );
}
