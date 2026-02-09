import { ToggleButton, Typography } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Box } from "@mui/material";
import { recommendChipSx } from "../../constants/design";
function HeaderRecommend({
    recommended,
    changeRecommendMutation,
    recommendList,
}) {
    return (
        <ToggleButton
            value="recommend"
            selected={recommended}
            onChange={() => changeRecommendMutation.mutate()}
            sx={{
                ...recommendChipSx,
                px: 1.1,
                textTransform: "none",
                bgcolor: "transparent",
                color: "text.primary",
                "& .MuiSvgIcon-root": {
                    fontSize: 18,
                    color: "error.main",
                },
                "&.Mui-selected": {
                    bgcolor: "transparent",
                    borderColor: "error.main",
                    "&:hover": { bgcolor: "transparent" },
                },
            }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    gap: 0.8,
                    pointerEvents: "none",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 20,
                        height: 20,
                    }}>
                    {recommended ? (
                        <FavoriteRoundedIcon />
                    ) : (
                        <FavoriteBorderRoundedIcon />
                    )}
                </Box>

                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 900,
                        lineHeight: 1,
                        minWidth: 30,
                        textAlign: "left",
                    }}>
                    추천 {recommendList?.data?.length ?? 0}
                </Typography>
            </Box>
        </ToggleButton>
    );
}

export default HeaderRecommend;
