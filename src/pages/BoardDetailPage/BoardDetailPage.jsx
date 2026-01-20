import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";

import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { usePrincipalState } from "../../store/usePrincipalState";
import {
  getBoardByBoardIdRequest,
  removeBoardRequest,
  plusRecommendRequest,
  minusRecommendRequest,
} from "../../apis/board/boardApi";

function InfoRow({ label, value, valueColor }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ py: 0.7 }}
    >
      <Typography
        sx={{ color: "text.secondary", fontWeight: 700, fontSize: 14 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: 14,
          color: valueColor ?? "text.primary",
        }}
      >
        {value ?? "-"}
      </Typography>
    </Stack>
  );
}

function BoardDetailPage() {
  const { boardId } = useParams();
  const boardIdNum = Number(boardId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { principal } = usePrincipalState();
  const userId = principal?.userId;

  // 추천 상태
  const [recommended, setRecommended] = useState(false);

  // (현재는 폼을 화면에 안 보여도, 로직 유지)
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

  // 점3개 메뉴 상태
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const {
    data: boardResp,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getBoardByBoardId", boardIdNum],
    queryFn: () => getBoardByBoardIdRequest(boardIdNum),
    enabled: Number.isFinite(boardIdNum) && boardIdNum > 0,
  });

  const boardData = boardResp?.data?.data;

  // 폼 초기화
  useEffect(() => {
    if (!boardData) return;
    setForm({
      title: boardData.title ?? "",
      content: boardData.content ?? "",
    });
  }, [boardData]);

  // 권한 체크
  const isOwner = useMemo(() => {
    return (
      userId != null &&
      boardData?.userId != null &&
      Number(userId) === Number(boardData.userId)
    );
  }, [userId, boardData]);

  // 추천(+)
  const plusRecommendedMutation = useMutation({
    mutationKey: ["plusRecommend", boardIdNum],
    mutationFn: (data) => plusRecommendRequest(data),
    onSuccess: (response) => {
      if (response?.status !== "success") {
        alert(response?.message ?? "추천 실패");
        return;
      }
      setRecommended(true);
      queryClient.invalidateQueries({
        queryKey: ["getBoardByBoardId", boardIdNum],
      });
      queryClient.invalidateQueries({ queryKey: ["getBoardListInfinite"] });
    },
    onError: (error) => {
      alert(error?.message ?? "추천 실패");
    },
  });

  // 추천(-)
  const minusRecommendedMutation = useMutation({
    mutationKey: ["minusRecommend", boardIdNum],
    mutationFn: (data) => minusRecommendRequest(data),
    onSuccess: (response) => {
      if (response?.status !== "success") {
        alert(response?.message ?? "취소 실패");
        return;
      }
      setRecommended(false);
      queryClient.invalidateQueries({
        queryKey: ["getBoardByBoardId", boardIdNum],
      });
      queryClient.invalidateQueries({ queryKey: ["getBoardListInfinite"] });
    },
    onError: (error) => {
      alert(error?.message ?? "취소 실패");
    },
  });

  const onClickRecommend = () => {
    if (!userId) return alert("로그인이 필요합니다.");
    if (!boardData) return;

    const payload = { userId: principal.userId, boardId: boardIdNum };
    if (recommended) minusRecommendedMutation.mutate(payload);
    else plusRecommendedMutation.mutate(payload);
  };

  // 삭제
  const removeMutation = useMutation({
    mutationKey: ["removeBoard", boardIdNum],
    mutationFn: removeBoardRequest,
    onSuccess: (response) => {
      if (response?.status !== "success") {
        alert(response?.message ?? "삭제 실패");
        return;
      }

      alert("게시물이 삭제 되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["getBoardListInfinite"] });
      queryClient.removeQueries({
        queryKey: ["getBoardByBoardId", boardIdNum],
      });
      navigate("/board");
    },
    onError: (error) => {
      alert(error?.message ?? "삭제 실패");
    },
  });

  const removeOnClickHandler = () => {
    closeMenu();
    if (!userId) return alert("로그인이 필요합니다.");
    if (!isOwner) return alert("삭제 권한이 없습니다.");
    if (!window.confirm("정말로 게시물을 삭제하시겠습니까?")) return;

    removeMutation.mutate({
      userId: principal.userId,
      boardId: boardIdNum,
    });
  };

  const editOnClickHandler = () => {
    closeMenu();
    if (!userId) return alert("로그인이 필요합니다.");
    if (!isOwner) return alert("수정 권한이 없습니다.");
    navigate(`/board/edit/${boardIdNum}`);
  };

  // 코스 리스트 저장(지금은 스타일만: 필요 시 API 연결)
  const saveToCourseListHandler = () => {
    closeMenu();
    if (!userId) return alert("로그인이 필요합니다.");
    alert("코스 리스트 저장 기능 연결 예정");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        p: { xs: 2, sm: 3 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 720 }}>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "white",
            borderColor: "divider",
          }}
        >
          {/* 상단 헤더 */}
          <Box sx={{ p: 2.2 }}>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={1.5}
            >
              <Typography
                sx={{ fontWeight: 900, fontSize: 20, lineHeight: 1.25 }}
              >
                {boardData?.title ?? form.title ?? "-"}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={0.8}>
                {/* 추천수 pill */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  onClick={onClickRecommend}
                  sx={{
                    px: 1,
                    py: 0.6,
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "grey.50",
                    cursor: "pointer",
                    userSelect: "none",
                    opacity:
                      !boardData ||
                      plusRecommendedMutation.isPending ||
                      minusRecommendedMutation.isPending
                        ? 0.6
                        : 1,
                  }}
                >
                  <ThumbUpAltOutlinedIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 900, fontSize: 13 }}>
                    {boardData?.recommendCnt ?? 0}
                  </Typography>
                </Stack>

                {/* 점 3개 */}
                <IconButton onClick={openMenu} sx={{ borderRadius: 2 }}>
                  <MoreVertIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={closeMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      minWidth: 180,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={saveToCourseListHandler}
                    sx={{ fontWeight: 800 }}
                  >
                    코스 리스트에 저장
                  </MenuItem>
                  <MenuItem
                    onClick={editOnClickHandler}
                    sx={{ fontWeight: 800 }}
                  >
                    수정
                  </MenuItem>
                  <MenuItem
                    onClick={removeOnClickHandler}
                    sx={{ fontWeight: 900, color: "error.main" }}
                  >
                    삭제
                  </MenuItem>
                </Menu>
              </Stack>
            </Stack>

            {/* 작성자 라인 */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.2}
              sx={{ mt: 1.2 }}
            >
              <Avatar
                sx={{ width: 36, height: 36 }}
                src={boardData?.profileImg ?? undefined}
              />
              <Stack spacing={0}>
                <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                  {boardData?.username ?? "-"}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                  {boardData?.createDt ?? "-"}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* 지도 영역(placeholder) */}
          <Box
            sx={{
              height: 280,
              bgcolor: "#E6E8EC",
              display: "grid",
              placeItems: "center",
              color: "text.secondary",
              fontWeight: 800,
            }}
          >
            지도 영역
          </Box>

          {/* 코스 정보 카드(현재는 값이 없으니 placeholder) */}
          <Box sx={{ p: 2 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2.5,
                bgcolor: "#F3F8FF",
                border: "1px solid",
                borderColor: "divider",
                p: 2,
              }}
            >
              <Stack spacing={0.2}>
                <InfoRow label="출발점" value="-" />
                <InfoRow label="도착점" value="-" />
                <InfoRow label="거리" value="-" valueColor="primary.main" />
                <InfoRow label="지역" value="-" />
              </Stack>
            </Paper>
          </Box>

          <Divider />

          {/* 기존 입력 폼은 스타일 화면에서는 숨김(로직은 유지) */}
          <Box sx={{ p: 2, display: "none" }}>
            {/* 필요 시 편집 UI로 전환해 사용할 수 있음 */}
            <input name="title" value={form.title} onChange={onChangeHandler} />
            <input
              name="content"
              value={form.content}
              onChange={onChangeHandler}
            />
          </Box>
        </Paper>

        {/* 로딩/에러 상태를 보여주고 싶으면(스타일 유지) 아래처럼 */}
        {(isLoading || error) && (
          <Box sx={{ mt: 2, color: "text.secondary", fontSize: 13 }}>
            {isLoading ? "로딩중..." : "조회 실패"}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default BoardDetailPage;
