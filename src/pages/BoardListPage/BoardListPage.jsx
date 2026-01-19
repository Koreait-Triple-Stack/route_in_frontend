import { Box, Container, Stack } from "@mui/system";
import React, { useState } from "react";
import { Button, Fab } from "@mui/material";
import TypeBox from "./TypeBox";
import FilterBox from "./FilterBox";
import PostCard from "./PostCard";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBoardListInfinite } from "../../apis/board/boardService";

function BoardListPage() {
    const [form, setForm] = useState({
        type: "ALL",
        region: "",
        distance: 0,
        parts: [],
    });
    const [tags, setTags] = useState([]);
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["getBoardListInfinite", { type: form.type, tags: tags, limit: 5 }],
            queryFn: getBoardListInfinite,
            initialPageParam: null,

            getNextPageParam: (lastPage) => {
                const d = lastPage.data;

                if (!d.hasNext) return undefined;

                return {
                    cursorCreateDt: d.nextCursorCreateDt,
                    cursorBoardId: d.nextCursorBoardId,
                };
            },
        });
    const boardList =
        data?.pages?.flatMap((p) => p?.data?.boardRespDtoList ?? []) ??
        [];

    const RoutineWritePage = () => navigate("/board/write/routine");
    const CourseWritePage = () => navigate("/board/write/course");

    if (isLoading) return <Box>로딩중</Box>;

    return (
        <Container maxWidth="sm" sx={{ padding: "20px", maxWidth: 500 }}>
            <TypeBox
                checked={checked}
                setChecked={setChecked}
                form={form}
                setForm={setForm}
                setTags={setTags}
            />
            {checked && (
                <FilterBox form={form} setForm={setForm} setTags={setTags} />
            )}
            <Stack spacing={2}>
                {boardList.map((board) => (
                    <PostCard key={board.boardId} board={board} />
                ))}
            </Stack>
            <Box
                sx={{
                    position: "fixed",
                    inset: 0, // 화면 전체를 덮는 레이어
                    zIndex: 1300,
                    pointerEvents: "none",
                }}>
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        bottom: 56 + 16,
                        width: "100%",
                        maxWidth: 600,
                        px: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                        pointerEvents: "none", // 기본은 none
                    }}>
                    <Box sx={{ pointerEvents: "auto" }}>
                        <Fab
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
