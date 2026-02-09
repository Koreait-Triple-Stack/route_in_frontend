import { ToggleButton } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Box } from "@mui/material";

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
                border: "1px solid #e5e5e5",
                borderRadius: "999px",
                overflow: "hidden",
                minWidth: 90,
                height: 32,
                textTransform: "none",
                "&.Mui-selected": {
                    borderColor: "#ff4d4f",
                    bgcolor: "transparent",
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
                        <FavoriteRoundedIcon
                            sx={{ fontSize: 18, color: "#ff4d4f" }}
                        />
                    ) : (
                        <FavoriteBorderRoundedIcon
                            sx={{ fontSize: 18, color: "#ff4d4f" }}
                        />
                    )}
                </Box>

                <Box
                    sx={{
                        fontSize: 14,
                        fontWeight: 900,
                        color: "black",
                        lineHeight: 1,
                        minWidth: 30,
                        textAlign: "left",
                    }}>
                    추천 {recommendList?.data?.length ?? 0}
                </Box>
            </Box>
        </ToggleButton>
    );
}

export default HeaderRecommend;
