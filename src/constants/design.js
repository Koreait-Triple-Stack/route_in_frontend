export const THEME = {
    bg: "#F0F4F8",
    paper: "#FFFFFF",
    accent: "#237ee0",
    point: "#5856D6", // 퍼플 블루
};

export const moduleStyle = {
    px: 2.5,
    py: 1.5,
    borderRadius: "20px",
    background: "#FFFFFF",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
    border: "1px solid #F1F5F9",
    display: "flex",
    flexDirection: "column",
    width: "100%",
};

// 게시판 태크/타입 칩
export const boardTagChipSx = (type) => ({
    height: 30,
    borderRadius: "999px",
    fontWeight: 500,
    "& .MuiChip-label": { px: 1.1, fontSize: 12 },

    color: type === "COURSE" ? THEME.accent : THEME.paper,
    bgcolor: type === "COURSE" ? "transparent" : THEME.accent,
    border: "1px solid",
    borderColor: type === "COURSE" ? THEME.accent : "transparent",
});

// 추천 Chip
export const recommendChipSx = {
    minWidth: 72,
    height: 32,
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: "999px",
    fontWeight: 600,
    "& .MuiChip-label": {
        px: 1.1,
        fontSize: 12,
    },
    "& .MuiChip-icon": {
        color: "error.main",
        fontSize: 18,
    },
};

// PostCard스타일
export const boardCardSx = {
    position: "relative",
    borderRadius: 5,
    px: 2,
    py: 2,
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "rgba(15,23,42,0.06)",
    boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
    overflow: "hidden",
    transition: "transform 160ms ease, box-shadow 160ms ease",

    // 상단 컬러바 (최신 느낌)
    "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        height: 4,
        width: "100%",
        background: "linear-gradient(90deg, #2563eb, #22c55e)",
    },

    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 18px 40px rgba(15,23,42,0.14)",
    },
};

// src/pages/board/TypeBox.sx.js

// 게시글 타입 토글 버튼 스타일 (TypeBox.jsx)
export const boardTypeBtnSx = {
    height: 36,
    px: 2.2,
    borderRadius: 2,
    fontWeight: 800,
    textTransform: "none",
    bgcolor: "#fff",
    color: "primary.main",
    border: "1px solid",
    borderColor: "primary.main",
    "&:hover": { bgcolor: "#fff" },
    "&.Mui-selected": {
        bgcolor: "primary.main",
        color: "#fff",
        borderColor: "primary.main",
        "&:hover": { bgcolor: "primary.dark" },
    },
};

// 정렬 Select 스타일 (TypeBox.jsx)
export const boardSortSelectSx = {
    height: 36,
    minWidth: 110,
    borderRadius: 2,
    bgcolor: "#fff",
    fontSize: 14,
    fontWeight: 800,
    color: "primary.main",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
    },
    "& .MuiSelect-select": { py: 0.9 },
    "& .MuiSelect-icon": { fontSize: 18 },
};

// 필터 버튼 스타일 (TypeBox.jsx)
export const boardFilterBtnSx = {
    width: 36,
    height: 36,
    borderRadius: 2,
    bgcolor: "#fff",
    color: "primary.main",
    border: "1px solid",
    borderColor: "primary.main",
    "&:hover": { bgcolor: "#fff" },
    "&.Mui-selected": {
        bgcolor: "primary.main",
        color: "#fff",
        "&:hover": { bgcolor: "primary.dark" },
    },
};
export const BUTTON_COLOR = {
    background: "linear-gradient(135deg, #2563eb, #22c55e)",
};

// 최신순 메뉴
export const selectMenuPaperSx = {
    mt: 1,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 10px 24px rgba(15,23,42,0.12)",
    overflow: "hidden",
    "& .MuiList-root": { py: 0.5 },
    "& .MuiMenuItem-root": {
        fontSize: 13,
        minHeight: 38,
        px: 1.6,
        mx: 0.6,
        my: 0.3,
        borderRadius: 1,
        "&:hover": { bgcolor: "action.hover" },
        "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "#fff",
            fontWeight: 800,
            "&:hover": { bgcolor: "primary.dark" },
        },
    },
};
