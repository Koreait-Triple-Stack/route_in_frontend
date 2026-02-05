import { fontWeight } from "@mui/system";

export const THEME = {
    bg: "#F0F4F8",
    paper: "#FFFFFF",
    accent: "#237ee0",
    point: "#5856D6",
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
};
export const boardTypeBtnSx = {
    height: 40,
    borderRadius: 3,
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

export const BUTTON_COLOR = {
    background: "linear-gradient(135deg, #2563eb, #22c55e)",
};

// 제목 입력칸
export const filterTextFieldSx = {
    "& .MuiOutlinedInput-root": {
        height: 40,
        borderRadius: 2,
        bgcolor: "action.hover",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "divider",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "text.secondary",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
    },
    "& .MuiInputLabel-root": {
        fontWeight: 800,
    },
};
// 필터 적용 초기화
export const filterActionBtnBaseSx = {
    height: 38,
    px: { xs: 1.4, sm: 2.2 },
    borderRadius: 2,
    fontWeight: 900,
    textTransform: "none",
};

export const pillToggleSx = {
    borderRadius: 999,
    px: 1.6,
    py: 0.7,
    fontWeight: 500,
    textTransform: "none",
    whiteSpace: "nowrap",
    bgcolor: "background.paper",
    borderColor: "divider",
    color: "text.primary",
    "&:hover": {
        bgcolor: "action.hover",
    },
    "&.Mui-selected": {
        bgcolor: "primary.main",
        borderColor: "primary.main",
        color: "#fff",
        "&:hover": {
            bgcolor: "primary.dark",
        },
    },
};
