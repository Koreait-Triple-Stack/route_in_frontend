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
        alignItems:"center",
        justifyContent:"center",
        height: "100vh",
        bgcolor: "",
        color: "#111", 
        boxSizing:"border-box",
        border: "1px solid #e5e7eb",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: "320px" }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            py: 1.8,
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            bgcolor: "blue",
          }}
          onClick={() => navigate("/board/running")}
        >
          러닝 코스
        </Button>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            py: 1.8,
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            bgcolor: "blue",
          }}
          onClick={() => navigate("/board/routine")}
        >
          운동 루틴 
        </Button>
      </Stack>
    </Box>
  );
}

export default WriteTypePage;
