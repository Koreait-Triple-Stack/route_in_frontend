import React from "react";
import { ToggleButton } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Box } from "@mui/material";

function HeaderRecommend({recommended, changeRecommendMutation, recommendList}) {
    return (
        <ToggleButton
            value="recommend"
            selected={recommended}
            onChange={() => changeRecommendMutation.mutate()}
            sx={{
                p: 0, // 내부 padding 제거하고 우리가 직접 배치
                border: "1px solid #e5e5e5",
                borderRadius: "999px",
                overflow: "hidden",
                minWidth: 72,
                height: 32,
                textTransform: "none",
                "&.Mui-selected": {
                    borderColor: "#ff4d4f",
                    bgcolor: "transparent",
                },
            }}>
            {/* 전체 클릭되게 하려면 내부 요소들이 pointerEvents 방해하지 않게 */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    px: 1.2,
                    gap: 0.8,
                    pointerEvents: "none", // ✅ 중요: 내부 영역은 클릭 이벤트를 막고, ToggleButton이 클릭을 받도록
                }}>
                {/* 왼쪽 아이콘 */}
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

                {/* 오른쪽 텍스트 */}
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
