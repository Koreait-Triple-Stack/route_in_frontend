import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usePrincipalState } from "../../store/usePrincipalState";
import {
  updateBoardRequest,
  removeBoardRequest,
  getBoardByBoardIdRequest,
} from "../../apis/board/boardApi";

function BoardDetailPage() {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const queryClient = useQueryClient();

  const { principal } = usePrincipalState();
  const userId = principal?.userId;

  const [boardData, setBoardData] = useState(null);

  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (!boardId) return;

    getBoardByBoardIdRequest(boardId)
      .then((res) => {
        if (res.data.status === "success") {
          setBoardData(res.data.data);
          return;
        }
        alert("조회 실패");
      })
      .catch((err) => {

        alert(err);
      });
  }, [boardId]);

  const isOwner = useMemo(() => {
    return !!userId && !!boardData?.userId && userId === boardData.userId;
  }, [userId, boardData]);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const removeBoardMutation = useMutation({
    mutationKey: ["removeBoard", boardId],
    mutationFn: (payload) => removeBoardRequest(payload),

    onSuccess: (res) => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["getBoardListByUserId", userId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["getBoardByBoardId", boardId],
      });

      alert("게시물 삭제 완료");
      navigate("/board");
    },

    onError: (error) => {
      alert(error);
    },
  });

  const removeOnClickHandler = () => {
    closeMenu();
    if (!boardId) return alert("게시글 정보가 없습니다.");
    if (!userId) return alert("로그인이 필요합니다.");
    if (!isOwner) return alert("삭제 권한이 없습니다.");
    if (!window.confirm("게시물을 삭제하시겠습니까?")) return;

    removeBoardMutation.mutate({
      boardId: Number(boardId),
      userId,
    });
  };

  const updateBoardMutation = useMutation({
    mutationKey: ["updateBoard", boardId],
    mutationFn: (payload) => updateBoardRequest(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["getBoardByBoardId", boardId],
      });
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["getBoardListByUserId", userId],
        });
      }

      
      alert("게시물 수정 완료");
      setIsEdit(false);
    },

    onError: (error) => {
      alert(error);
    },
  });

  const startEditHandler = () => {
    closeMenu();
    if (!isOwner) return alert("수정 권한이 없습니다.");

    setEditTitle(boardData?.title ?? "");
    setEditContent(boardData?.content ?? "");
    setIsEdit(true);
  };

  const saveEditHandler = () => {
    if (!boardId) return alert("게시글 정보가 없습니다.");
    if (!userId) return alert("로그인이 필요합니다.");
    if (!isOwner) return alert("수정 권한이 없습니다.");

    if (!editTitle.trim() || !editContent.trim()) {
      return alert("제목/내용을 입력해주세요.");
    }

    updateBoardMutation.mutate({
      boardId: Number(boardId),
      userId,
      title: editTitle.trim(),
      content: editContent.trim(),
    });
  };

  const cancelEditHandler = () => {
    setIsEdit(false);
    setEditTitle("");
    setEditContent("");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 2 }}>
      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            {isEdit ? (
              <TextField
                fullWidth
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목"
              />
            ) : (
              <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                {boardData?.title ?? "-"}
              </Typography>
            )}

            <Typography
              sx={{
                mt: 0.5,
                color: "text.secondary",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {boardData?.nickname ?? "-"} · {boardData?.createdAt ?? "-"}
            </Typography>
          </Box>

          {/* 작성자만 메뉴 표시 */}
          {isOwner && (
            <>
              <IconButton onClick={openMenu}>
                <MoreVertIcon />
              </IconButton>

              <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
                <MenuItem onClick={startEditHandler}>수정</MenuItem>
                <MenuItem
                  onClick={removeOnClickHandler}
                  sx={{ color: "error.main" }}
                >
                  삭제
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* 본문 */}
        <Box sx={{ mt: 2 }}>
          {isEdit ? (
            <TextField
              fullWidth
              multiline
              minRows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="내용"
            />
          ) : (
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {boardData?.content ?? "-"}
            </Typography>
          )}
        </Box>

        {isEdit && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={cancelEditHandler}
              disabled={updateBoardMutation.isPending}
            >
              취소
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={saveEditHandler}
              disabled={updateBoardMutation.isPending}
            >
              {updateBoardMutation.isPending ? "저장 중..." : "저장"}
            </Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

export default BoardDetailPage;
