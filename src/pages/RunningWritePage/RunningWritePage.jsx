import { Button, Divider, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
function RunningWritePage() {
  const navigate = useNavigate();
  const { principal } = usePrincipalState();
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [distance, setDistance] = useState("");
  const [location, setLocation] = useState("");
  const [write, setWrite] = useState("");

  const titleInputOnChangeHandler = (e) => {
    setTitle(e.target.value);
  };
  const startInputOnChangeHandler = (e) => {
    setStart(e.target.value);
  };
  const endInputOnChangeHandler = (e) => {
    setEnd(e.target.value);
  };
  const distanceInputOnChangeHandler = (e) => {
    setDistance(e.target.value);
  };
  const locationInputOnChangeHandler = (e) => {
    setLocation(e.target.value);
  };
  const writeInputOnChangeHandler = (e) => {
    setWrite(e.target.value);
  };

  const submitOnClickHandler = async () => {
    if (!principal?.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 빈칸 체크
    if (
      title.trim().length === 0 ||
      start.trim().length === 0 ||
      end.trim().length === 0 ||
      distance.trim().length === 0 ||
      location.trim().length === 0 ||
      write.trim().length === 0
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 서버로 보낼 데이터
    const data = {
      title: title.trim(),
      start: start.trim(),
      end: end.trim(),
      distance: distance.trim(),
      location: location.trim(),
      content: write.trim(),
      userId: principal.userId,
    };

    try {
      const response = await addBoardRequest(data);

      if (response?.data.status === "success") {
        alert("게시글이 추가되었습니다.");
        navigate("/board/list");
      } else {
        alert(response?.data.message === "failed");
      }
    } catch (e) {
      console.error(e);
      alert("서버 요청에 실패 했습니다.");
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

      <Box>코스 지도</Box>
      <Divider />
      <Box sx={{}}>
        코스정보
        <TextField
          id="start"
          name="start"
          label="출발점"
          type="text"
          placeholder="출발점을 입력하세요."
          fullWidth
          variant="outlined"
          value={start}
          onChange={startInputOnChangeHandler}
        />
        <TextField
          id="end"
          name="end"
          label="도착점"
          type="text"
          placeholder="도착점을 입력하세요."
          fullWidth
          variant="outlined"
          value={end}
          onChange={endInputOnChangeHandler}
        />
        <TextField
          id="distance"
          name="distance"
          label="거리 (km)"
          type="number"
          placeholder="예: 5.2."
          fullWidth
          variant="outlined"
          value={distance}
          onChange={distanceInputOnChangeHandler}
          inputProps={{ step: "0.1" }}
        />
        <TextField
          id="location"
          name="location"
          label="지역"
          type="text"
          placeholder="예: 서울 강남구"
          fullWidth
          variant="outlined"
          value={location}
          onChange={locationInputOnChangeHandler}
        />
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

export default RunningWritePage;
