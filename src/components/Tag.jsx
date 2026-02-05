import React, { useState, useEffect } from "react";
import {
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    Stack,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { usePrincipalState } from "../store/usePrincipalState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeChecked } from "../apis/routine/routineService";

export default function Tag({ text, checked, onClick, onDelete, sx }) {
    return (
        <Box
            component="button"
            type="button"
            onClick={onClick}
            // 삭제 아이콘 클릭이 onClick으로 버블링되는 걸 막고 싶으면 여기서 처리
            style={{ all: "unset" }}
            sx={{
                cursor: onClick ? "pointer" : "default",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.45,
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                lineHeight: 1.2,

                // ✅ 반응형 줄어듦 + ... (핵심)
                minWidth: 0,
                maxWidth: "100%",
                flex: "0 1 auto",

                textDecoration: checked ? "line-through" : "none",
                bgcolor: checked ? "#F1F5F9" : "#E0F2FE",
                color: checked ? "#CBD5E1" : "#0369A1",

                "&:hover": {
                    bgcolor: "#BAE6FD",
                },

                ...sx,
            }}>
            {/* ✅ 텍스트 영역에 ellipsis */}
            <Box
                component="span"
                sx={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                }}>
                {text}
            </Box>

            {/* ✅ 삭제 버튼 (편집 모드에서만 사용) */}
            {onDelete && (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    sx={{
                        p: 0.2,
                        ml: 0.2,
                        color: "inherit",
                        flexShrink: 0,
                    }}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            )}
        </Box>
    );
};