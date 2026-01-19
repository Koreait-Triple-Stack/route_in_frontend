import { Box, Container, Stack } from "@mui/system";
import React, { useState } from "react";
import { Button, Fab } from "@mui/material";
import TypeBox from "./TypeBox";
import FilterBox from "./FilterBox";
import PostCard from "./PostCard";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useNavigate } from "react-router-dom";
import { useExerciseTagStore } from "../../store/useExerciseTagStore";

function BoardListPage() {
    const [form, setForm] = useState({
        type: "ALL",
        region: "",
        distance: 0,
        tags: [],
    })
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();


    const RoutineWritePage = () => navigate("/board/write/routine");
    const CourseWritePage = () => navigate("/board/write/course");
    const posts = [
        {
            id: "1",
            category: "COURSE",
            title: "한강 야경 러닝 코스 추천합니다",
            author: "러닝마니아",
            age: "20대",
            date: "2026-01-07",
            meta: ["📍 서울 영등포구", "5.2km"],
        },
        {
            id: "2",
            category: "ROUTINE",
            title: "초보자를 위한 3분할 루틴",
            author: "헬창",
            age: "30대",
            date: "2026-01-06",
            meta: ["가슴", "등", "하체"],
        },
        {
            id: "3",
            category: "ROUTINE",
            title: "초보자를 위한 3분할 루틴",
            author: "헬창",
            age: "30대",
            date: "2026-01-06",
            meta: ["가슴", "등", "하체"],
        },
    ];

    return (
        <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 500 }}>
            <TypeBox
                checked={checked}
                setChecked={setChecked}
            />
            {checked && (
                <FilterBox
                    form={form}
                    setForm={setForm}
                />
            )}
            <Stack spacing={2}>
                {posts
                    .filter(
                        (post) =>
                            form.type === "ALL" || form.type === post.category
                    )
                    .filter((post) => {
                        if (form.type === "ALL") {
                            return post;
                        } else if (form.type === "COURSE") {
                            if (
                                post.meta[0].includes(form.region) &&
                                (!form.distance ||
                                    parseFloat(post.meta[1]) <=
                                        parseFloat(form.distance))
                            ) {
                                return post;
                            }
                        } else if (form.type === "ROUTINE") {
                            if (
                                form.tags.length === 0 ||
                                form.tags.some((tag) =>
                                    post.meta.includes(tag)
                                )
                            ) {
                                return post;
                            }
                        }
                    })
                    .map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
            </Stack>
            <Box
                sx={{
                    position: "fixed",
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: 56 + 16, // BottomNav(56) 위로 16px
                    width: "100%",
                    maxWidth: 600, // Container sm 폭
                    px: 2,
                    zIndex: 1300,
                    pointerEvents: "none", // ✅ 박스는 클릭 막고
                }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        pointerEvents: "auto",
                    }}>
                    <Fab
                        // onClick={() => setOpenDeleteAll(true)}
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: "grey.200",
                            color: "text.primary",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                            "&:hover": { bgcolor: "grey.300" },
                        }}>
                        <CreateOutlinedIcon />
                    </Fab>
                </Box>
            </Box>
            <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={RoutineWritePage}>
                    루틴 작성
                </Button>
                <Button variant="contained" onClick={CourseWritePage}>
                    러닝 작성
                </Button>
            </Stack>
        </Container>
    );
}

export default BoardListPage;
