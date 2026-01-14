import { Button } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";

function WriteTypePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        overflow: "hidden",
        width: "100vw",
        bgcolor: "",
        color: "#111",
      
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: "500px", px: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            minheight:72,
            py: 20,
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            bgcolor: "blue",
          }}
          onClick={() => navigate("/board/write/type/running")}
        >
          러닝 코스
        </Button>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            py: 20,
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            bgcolor: "blue",
          }}
          onClick={() => navigate("/board/write/type/routine")}
        >
          운동 루틴
        </Button>
      </Stack>
    </Box>
  );
}

export default WriteTypePage;
