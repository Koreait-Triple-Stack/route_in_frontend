import { Box, Container, Stack } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import TypeBox from "./TypeBox";
import FilterBox from "./FilterBox";
import PostCard from "./PostCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBoardListInfinite } from "../../apis/board/boardService";
import { ClipLoader } from "react-spinners";
import WriteDial from "./WriteDial";
import Loading from "../../components/Loading";
import { Paper, Typography } from "@mui/material";

function BoardListPage() {
    const [form, setForm] = useState({
        type: "ALL",
        sort: "LATEST",
        region: "",
        distance: 0,
        parts: [],
    });
    const [tags, setTags] = useState([]);
    const [checked, setChecked] = useState(false);
    const bottomRef = useRef(null);
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: [
                "getBoardListInfinite",
                { type: form.type, sort: form.sort, tags: tags, limit: 5 },
            ],
            queryFn: getBoardListInfinite,
            initialPageParam: null,

            getNextPageParam: (lastPage) => {
                const d = lastPage.data;

                if (!d.hasNext) return undefined;

                if (form.sort === "RECOMMEND") {
                    return {
                        cursorRecommendCnt: d.nextCursorRecommendCnt,
                        cursorBoardId: d.nextCursorBoardId,
                    };
                }

                return {
                    cursorCreateDt: d.nextCursorCreateDt,
                    cursorBoardId: d.nextCursorBoardId,
                };
            },
        });
    const boardList =
        data?.pages?.flatMap((p) => p?.data?.boardRespDtoList ?? []) ?? [];

    useEffect(() => {
        if (!bottomRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first.isIntersecting) return;
                if (!hasNextPage) return;
                if (isFetchingNextPage) return;

                fetchNextPage();
            },
            { threshold: 0.1 },
        );

        observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) return <Loading />;

    return (
        <Container>
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
                <Box sx={{ height: 1 }} ref={bottomRef} />
            </Stack>
            {isFetchingNextPage && (
                <Box>
                    <ClipLoader />
                </Box>
            )}
            {!hasNextPage && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        textAlign: "center",
                    }}>
                    <Typography sx={{ fontWeight: 800 }}>
                        마지막 페이지 입니다
                    </Typography>
                </Paper>
            )}

            <WriteDial />
        </Container>
    );
}

export default BoardListPage;
