import React, { useState } from "react";
import {
  Box,
  IconButton,
  ToggleButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useParams } from "react-router-dom";

function CourseDetailPage() {

  const {boardId} = useParams();
  const likedPreview = false;
  const likeCountPreview = 12;
  const { principal } = usePrincipalState();

  const [anchorEl, setAnchorEl] = useState(null); // ✅ null
  const menuOpen = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
            <MenuItem onClick={handleClose}>코스 리스트에 저장</MenuItem>
            <MenuItem onClick={handleClose}>수정</MenuItem>
            <MenuItem onClick={handleClose}>삭제</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* 작성자 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 2 }}>
        <Box
          component="img"
          src="https://firebasestorage.googleapis.com/v0/b/board-study-26e00.firebasestorage.app/o/profile-img%2F40aaf171-5eae-4e81-96af-a89730616960_jpeg?alt=media&token=86b09376-18b3-49a9-881d-2b5ae5a728eb"
          sx={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
        <Typography sx={{ fontWeight: 700 }}>{principal?.username}</Typography>
      </Box>

      {/* 지도 */}
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

      {/* 정보(세로로, 라벨-값은 가로) */}
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

export default CourseDetailPage;
