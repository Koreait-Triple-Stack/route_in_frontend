export const glassCardSx = {
    borderRadius: 4,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    transition:
        "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
    "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 18px 44px rgba(15, 23, 42, 0.12)",
        borderColor: "rgba(99,102,241,0.35)",
    },
    "&:active": { transform: "translateY(0px)" },
};

export const softPillSx = {
    borderRadius: 999,
    textTransform: "none",
    fontWeight: 800,
    px: 1.4,
    py: 1.2,
    lineHeight: 1,
};

export const subtleRingSx = {
    "&.Mui-focusVisible": {
        outline: "3px solid rgba(99,102,241,0.25)",
        outlineOffset: 2,
    },
};

export const sectionTitleSx = {
    fontSize: 22,
    fontWeight: 950,
    letterSpacing: "-0.02em",
};

export const chipBaseSx = {
    borderRadius: 999,
    fontWeight: 800,
    "& .MuiChip-icon": { mr: -0.2 },
};
