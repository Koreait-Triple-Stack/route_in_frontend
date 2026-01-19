import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";

import {
  Box,
  Typography,
  ToggleButton,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Paper,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "@mui/system";

const DAYS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

const PREVIEW = {
  월요일: [],
  화요일: [],
  수요일: [],
  목요일: [],
  금요일: [],
  토요일: [],
  일요일: [],
};

function RoutineDaySection({ dayLabel, items }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 1.2 }}>
        {dayLabel}
      </Typography>

      {items.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 1.3,
            borderColor: "divider",
            boxShadow: "none",
          }}
        >
          <Typography
            sx={{ color: "text.secondary", fontWeight: 600, fontSize: 14 }}
          >
            등록된 운동이 없습니다.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.1}>
          {items.map((it) => (
            <Paper
              key={it.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 1.5,
                py: 1.15,
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                borderColor: "divider",
                boxShadow: "none",
                transition: "transform 120ms ease, background-color 120ms ease",
                "&:hover": { backgroundColor: "action.hover" },
                "&:active": { transform: "scale(0.995)" },
              }}
            >
              <Checkbox
                checked={!!it.done}
                sx={{
                  p: 0.5,
                  "& .MuiSvgIcon-root": { fontSize: 22 },
                }}
              />

              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {it.name}
              </Typography>

              <Typography
                sx={{
                  ml: "auto",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "text.secondary",
                }}
              >
                {it.scheme}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function BoardDetailPage() {
  const { type, boardId } = useParams();

  if (type === "routine") return <RoutineDetailPage boardId={boardId} />;
  if (type === "running") return <RunningDetailPage boardId={boardId} />;

  return <Box></Box>;
}

// RoutineDetailPage-----------------------------------------------------------------------------------
// RoutineDetailPage-----------------------------------------------------------------------------------
function RoutineDetailPage({ boardId }) {
  const likedPreview = false;
  const likeCountPreview = 12;
  const navigate = useNavigate();
  const { principal } = usePrincipalState();

  // mui의 Menu를 열고 닫기 위한 "기준 위치 + 열림 여부"
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // 프리뷰 데이터(나중에 실제 데이터로 교체)
  const PREVIEW = {
    월요일: [],
    화요일: [],
    수요일: [],
    목요일: [],
    금요일: [],
    토요일: [],
    일요일: [],
  };

  // 요일 섹션(스타일만)
  function RoutineDaySection({ dayLabel, items }) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 1.2 }}>
          {dayLabel}
        </Typography>

        {items.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 1.5,
              py: 1.3,
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <Typography
              sx={{ color: "text.secondary", fontWeight: 600, fontSize: 14 }}
            >
              등록된 운동이 없습니다.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.1}>
            {items.map((it) => (
              <Paper
                key={it.id}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 1.15,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  borderColor: "divider",
                  boxShadow: "none",
                  transition:
                    "transform 120ms ease, background-color 120ms ease",
                  "&:hover": { backgroundColor: "action.hover" },
                  "&:active": { transform: "scale(0.995)" },
                }}
              >
                <Checkbox
                  checked={!!it.done}
                  sx={{
                    p: 0.5,
                    "& .MuiSvgIcon-root": { fontSize: 22 },
                  }}
                />

                <Typography
                  sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}
                >
                  {it.name}
                </Typography>

                <Typography
                  sx={{
                    ml: "auto",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "text.secondary",
                  }}
                >
                  {it.scheme}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {/* 제목 + 좋아요 + 메뉴 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
          초보자를 위한 운동 3분할 루틴
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ToggleButton value="like" selected={likedPreview} disableRipple>
            {likedPreview ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <Typography>{likeCountPreview}</Typography>
          </ToggleButton>

          <IconButton onClick={handleOpen} aria-label="more">
            <MoreVertIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
            <MenuItem onClick={handleClose}>운동 루틴에 저장</MenuItem>
            <MenuItem onClick={handleClose}>수정</MenuItem>
            <MenuItem onClick={handleClose}>삭제</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* 작성자 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 2 }}>
        <Box
          component="img"
          src=""
          alt="profile"
          sx={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: "50%",
            bgcolor: "grey.200",
          }}
        />
        <Typography sx={{ fontWeight: 700 }}>{principal?.username}</Typography>
      </Box>

      {/* 요일 전체(스타일) */}
      <Box
        sx={{
          mt: 2,
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 2,
          p: 2,
          mb: 1.5,
        }}
      >
        <Stack spacing={2.2}>
          {DAYS.map((day) => (
            <RoutineDaySection
              key={day}
              dayLabel={day}
              items={PREVIEW[day] ?? []}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}




// RunningDetailPage-----------------------------------------------------------------------------------
function RunningDetailPage({ boardId }) {
  const likedPreview = false;
  const likeCountPreview = 12;
  const usenavigate = useNavigate();
  const { principal } = usePrincipalState();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);


  
  // const { data } = useQuery({
  //   queryKey: ["boardLike", boardId],
  //   queryFn: () => getBoardLike(boardId),
  //   enabled: !!boardId,
  // });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
          한강 야경 러닝 코스 추천합니다.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ToggleButton value="like" selected={likedPreview} disableRipple>
            {likedPreview ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <Typography>{likeCountPreview}</Typography>
          </ToggleButton>

          <IconButton onClick={handleOpen} aria-label="more">
            <MoreVertIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
            <MenuItem
              onClick={() => {
                handleClose();
              }}
            >
              코스 리스트에 저장
            </MenuItem>

            {loginUser && (
              <>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate();
                  }}
                >
                  수정
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose;
                  }}
                >
                  삭제
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 2 }}>
        <Box
          component="img"
          src=""
          alt="profile"
          sx={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: "50%",
            bgcolor: "grey.200",
          }}
        />
        <Typography sx={{ fontWeight: 700 }}>{principal?.username}</Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: 180,
          bgcolor: "#e9ecef",
          mt: 2,
          mb: 2,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        지도 영역
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
        {[
          ["출발점", "출발점"],
          ["도착점", "도착점"],
          ["거리", "5.2km"],
          ["지역", "서울"],
        ].map(([label, value]) => (
          <Box
            key={label}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <Typography sx={{ fontWeight: 700, width: 64 }}>{label}</Typography>
            <Typography>{value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
