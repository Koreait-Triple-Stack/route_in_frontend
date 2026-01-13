import { Container, Stack } from "@mui/system";
import React, { useState } from "react";
import { Fab } from "@mui/material";
import TypeBox from "./TypeBox";
import FilterBox from "./FilterBox";
import PostCard from "./PostCard";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useNavigate } from "react-router-dom";
import { useExerciseTagStore } from "../../store/useExerciseTagStore";
import { TAG_ID_TO_LABEL } from "../../apis/utils/tagMaps";

function BoardListPage() {
    const [type, setType] = useState("전체");
    const [checked, setChecked] = useState(false);
    const [region, setRegion] = useState("");
    const [distance, setDistance] = useState("");
    const navigate = useNavigate();
    const { selectedTagIds, toggleTag, resetTags } = useExerciseTagStore();

    const posts = [
        {
            id: "1",
            category: "러닝코스",
            title: "한강 야경 러닝 코스 추천합니다",
            author: "러닝마니아",
            age: "20대",
            date: "2026-01-07",
            meta: ["📍 서울 영등포구", "5.2km"],
        },
        {
            id: "2",
            category: "운동루틴",
            title: "초보자를 위한 3분할 루틴",
            author: "헬창",
            age: "30대",
            date: "2026-01-06",
            meta: ["가슴", "등", "하체"],
        },
    ];

    return (
        <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 400 }}>
            <TypeBox
                type={type}
                setType={setType}
                checked={checked}
                setChecked={setChecked}
            />
            {checked && (
                <FilterBox
                    type={type}
                    region={region}
                    setRegion={setRegion}
                    distance={distance}
                    setDistance={setDistance}
                    selectedTagIds={selectedTagIds}
                    toggleTag={toggleTag}
                    resetTags={resetTags}
                />
            )}
            <Stack spacing={2}>
                {posts
                    .filter((post) => type === "전체" || type === post.category)
                    .filter((post) => {
                        if (type === "전체") {
                            return post;
                        } else if (type === "러닝코스") {
                            if (
                                post.meta[0].includes(region) &&
                                (!distance ||
                                    parseFloat(post.meta[1]) <= distance)
                            ) {
                                return post;
                            }
                        } else if (type === "운동루틴") {
                            if (selectedTagIds.length === 0 || selectedTagIds.some((id) => post.meta.includes(TAG_ID_TO_LABEL[id]))) {
                                return post;
                            }
                        }
                    })
                    .map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
            </Stack>
            <Fab
                onClick={() => navigate("/board/write/type")}
                sx={{
                    position: "fixed",
                    left: "50%",
                    transform: "translateX(calc(min(360px, 100vw) / 2 - 56px))",
                    bottom: 80,
                    zIndex: 1400,
                }}>
                <CreateOutlinedIcon />
            </Fab>
        </Container>
    );
}

export default BoardListPage;
