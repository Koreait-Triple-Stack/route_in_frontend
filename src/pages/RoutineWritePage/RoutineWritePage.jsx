import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";

const DAYS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

function RoutineWritePage() {
  const [title, setTitle] = useState("");
  const [write, setWrite] = useState("");
  const navigate = useNavigate();
  const { principal } = usePrincipalState();

  // 요일별 운동 목록 저장할 객체
  const [routine, setRoutine] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );

  const titleInputOnChangeHandler = (e) => setTitle(e.target.value);
  const writeInputOnChangeHandler = (e) => setWrite(e.target.value);

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

    // 입력받은 데이터를 한 덩어리로 묶어서 저장하기 위함
    const addRoutine = {
      id: Date.now(), // 운동 삭제를 위함
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

  //  저장(서버 전송)
  const submitOnClickHandler = async () => {
    // 제목 검사
    if (title.trim().length === 0) {
      alert("제목을 작성해 주세요 .");
      return;
    }

    // 하나 이상의 루틴 작성 검사
    const routines = Object.values(routine).some((arr) => arr.length > 0);
    if (!routines) {
      alert("하나 이상의 루틴을 추가해주세요");
      return;
    }

    // 로그인한 사람인지
    if (!principal?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 서버로 보낼 정보
    const send = Object.entries(routine).flatMap(([day, arr]) =>
      arr.map((information) => ({
        day,
        name: information.name,
        exercise: information.exercise,
      }))
    );

    // 서버로 보낼 요청 데이터 묶음
    const data = {
      title: title,
      write: write,
      userId: principal?.userId,
      send,
    };
    try {
      const response = await addRoutineRequest(data);

      if (response?.data?.status === "success") {
        alert("게시물 작성이 완료되었습니다.");
        navigate("/board");
      } else {
        alert(response?.data?.message ?? "저장 실패");
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
        <Typography sx={{}}>운동 부위</Typography>



        <Divider />

        <Typography sx={{}}>운동 루틴</Typography>

        <Stack spacing={2}>
          {DAYS.map((day) => (
            <Box key={day} sx={{}}>
              <Box sx={{}}>
                <Typography sx={{ fontWeight: "bold" }}>{day}</Typography>
                <Button variant="outlined" onClick={() => handleOpenForm(day)}>
                  운동 추가
                </Button>
              </Box>

              {routine[day].length === 0 ? (
                <Typography sx={{ mt: 1 }} color="">
                  운동을 추가해주세요
                </Typography>
              ) : (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {routine[day].map((item) => (
                    <Box key={item.id} sx={{}}>
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

export default RoutineWritePage;
