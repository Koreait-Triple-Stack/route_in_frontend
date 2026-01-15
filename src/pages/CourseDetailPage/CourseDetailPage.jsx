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
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";

function CourseDetailPage() {
  const likedPreview = false;
  const likeCountPreview = 12;
  const usenavigate = useNavigate();
  const { principal } = usePrincipalState();

  // mui의 Menu를 열고 닫기 위한 "기준 위치 + 열림 여부" 상태 코드
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // 메뉴 열기
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // 메뉴 닫기
  const handleclose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Box sx={{}}>
        <Typography>한강 야경 러닝 코스 추천합니다.</Typography>

        <Box sx={{}}>
          <ToggleButton
            value="like"
            selected={likedPreview}
            disableRipple
            sx={{}}
          >
            {likedPreview ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <Typography>{likeCountPreview}</Typography>
          </ToggleButton>

          <IconButton onClick={handleOpen} aria-label="more">
            <MoreVertIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleclose}>
            <MenuItem onClick={handleclose}>코스 리스트에 저장</MenuItem>
            <MenuItem onClick={handleclose}>수정</MenuItem>
            <MenuItem onClick={handleclose}>삭제</MenuItem>
          </Menu>
        </Box>

        <Box
          component="img"
          src="https://firebasestorage.googleapis.com/v0/b/board-study-26e00.firebasestorage.app/o/profile-img%2F40aaf171-5eae-4e81-96af-a89730616960_jpeg?alt=media&token=86b09376-18b3-49a9-881d-2b5ae5a728eb"
          sx={{
            width: 64,
            height: 64,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        ></Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography>{principal?.username}</Typography>
        </Box>
      </Box>

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
        지도 영역
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Typography sx={{ fontWeight: 700, width: 64 }}>출발점</Typography>
          <Typography>출발점</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Typography sx={{ fontWeight: 700, width: 64 }}>도착점</Typography>
          <Typography>도착점</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Typography sx={{ fontWeight: 700, width: 64 }}>거리</Typography>
          <Typography>5.2km</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Typography sx={{ fontWeight: 700, width: 64 }}>지역</Typography>
          <Typography>서울</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CourseDetailPage;
