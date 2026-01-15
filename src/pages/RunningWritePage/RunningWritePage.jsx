import { Button, Divider, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import { addBoardRequest } from "../../apis/board/boardApi";

function RunningWritePage() {
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
      type: "",
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

export default RunningWritePage;
