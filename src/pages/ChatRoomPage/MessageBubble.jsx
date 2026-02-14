import { Box } from "@mui/system";
import { getMessageListInfiniteRequest } from "../../apis/chat/chatApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import MessageBubbleComponent from "./MessageBubbleComponent";
import { ClipLoader } from "react-spinners";
import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { usePrincipalState } from "../../store/usePrincipalState";

const MessageBubble = forwardRef(function MessageBubble({ roomId }, ref) {
    const scrollerRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const needAdjustRef = useRef(false);
    const didInitScrollRef = useRef(false);

    const { principal } = usePrincipalState();

    const scrollToBottom = () => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    };

    useImperativeHandle(ref, () => ({
        scrollToBottom,
    }));

    const {
        data: messageResp,
        isLoading: messageLoading,
        error: messageError,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: [
            "getMessageListInfiniteRequest",
            { roomId, userId: principal?.userId, limit: 20 },
        ],
        queryFn: getMessageListInfiniteRequest,
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            const d = lastPage.data;
            if (!d.hasNext) return undefined;
            return {
                cursorCreateDt: d.nextCursorCreateDt,
                cursorMessageId: d.nextCursorMessageId,
            };
        },
        enabled: Number.isFinite(roomId) && roomId > 0 && !!principal?.userId,
    });

    const messageList =
        messageResp?.pages?.flatMap((p) => p?.data?.messageList ?? []) ?? [];

    const handleScroll = () => {
        const el = scrollerRef.current;
        if (!el) return;

        if (el.scrollTop <= 20 && hasNextPage && !isFetchingNextPage) {
            prevScrollHeightRef.current = el.scrollHeight;
            needAdjustRef.current = true;
            fetchNextPage();
        }
    };

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        if (!needAdjustRef.current) return;

        const prevH = prevScrollHeightRef.current;
        const diff = el.scrollHeight - prevH;
        el.scrollTop = el.scrollTop + diff;

        needAdjustRef.current = false;
        prevScrollHeightRef.current = 0;
    }, [messageList.length]);

    useLayoutEffect(() => {
        if (!didInitScrollRef.current && messageList.length > 0) {
            didInitScrollRef.current = true;
            scrollToBottom();
        }
    }, [messageList.length]);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        let prevVh = vv.height;
        let raf = 0;

        const onResize = () => {
            const el = scrollerRef.current;
            if (!el) return;

            const nextVh = vv.height;
            const delta = prevVh - nextVh;
            prevVh = nextVh;

            if (delta > 0) {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    el.scrollTop += delta;
                });
            }
        };

        vv.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            vv.removeEventListener("resize", onResize);
        };
    }, []);

    if (messageLoading) return <Loading />;
    if (messageError) return <ErrorComponent error={messageError} />;

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                overflow: "hidden",
            }}>
            <Box
                ref={scrollerRef}
                data-chat-scroller="1"
                onScroll={handleScroll}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    overscrollBehavior: "contain",
                    WebkitOverflowScrolling: "touch",
                    touchAction: "pan-y",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    py: 1,
                }}>
                <Box
                    sx={{
                        px: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    {isFetchingNextPage && (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <ClipLoader />
                        </Box>
                    )}

                    {[...messageList].reverse().map((msg) => (
                        <MessageBubbleComponent
                            key={msg.messageId}
                            message={msg}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
});

export default MessageBubble;
