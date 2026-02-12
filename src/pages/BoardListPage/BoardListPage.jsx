import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import TypeBox from "./TypeBox";
import FilterBox from "./FilterBox";
import PostCard from "./PostCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBoardListInfinite } from "../../apis/board/boardService";
import { ClipLoader } from "react-spinners";
import WriteDial from "./WriteDial";
import Loading from "../../components/Loading";
import { Collapse, List, Paper, Typography } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { sectionTitleSx } from "../../constants/boardDesign";

function BoardListPage() {
    const [form, setForm] = useState({
        type: "ALL",
        sort: "LATEST",
        region: "",
        distance: "",
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
        <Box
            sx={{
                px: { xs: 1.5, sm: 2 },
                position: "relative",
                "&:before": {
                    content: '""',
                    position: "absolute",
                    inset: -12,
                    zIndex: -1,
                    background:
                        "radial-gradient(800px 240px at 20% 0%, rgba(99,102,241,0.20), transparent 60%)," +
                        "radial-gradient(700px 220px at 80% 10%, rgba(168,85,247,0.16), transparent 55%)",
                },
            }}>
            <Typography sx={{ ...sectionTitleSx, px: 1, py: 2 }}>
                게시판
            </Typography>
            <TypeBox
                checked={checked}
                setChecked={setChecked}
                form={form}
                setForm={setForm}
                setTags={setTags}
            />

            <Collapse in={checked}>
                <FilterBox form={form} setForm={setForm} setTags={setTags} />
            </Collapse>

            <List sx={{ p: 0 }}>
                {boardList.map((board) => (
                    <PostCard key={board.boardId} board={board} />
                ))}
                <Box sx={{ height: 1 }} ref={bottomRef} />
            </List>

            {isFetchingNextPage && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <ClipLoader />
                </Box>
            )}
            {!hasNextPage && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        mb: 1,
                    }}>
                    <Paper
                        elevation={0}
                        sx={{
                            py: 2,
                            width: "100%",
                            borderRadius: "999px",
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "rgba(255,255,255,0.70)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 0.8,
                        }}>
                        <ErrorOutlineRoundedIcon
                            sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 13,
                                color: "text.secondary",
                            }}>
                            마지막 페이지입니다
                        </Typography>
                    </Paper>
                </Box>
            )}

            <WriteDial />
        </Box>
    );
}
export default BoardListPage;
