import { Box } from "@mui/system";
import { getMessageListInfiniteRequest } from "../../apis/chat/chatApi";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import MessageBubbleComponent from "./MessageBubbleComponent";
import { ClipLoader } from "react-spinners";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePrincipalState } from "../../store/usePrincipalState";

function MessageBubble({ roomId }) {
    const bottomRef = useRef(null);
    const scrollerRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const needAdjustRef = useRef(false);
    const didInitScrollRef = useRef(false);
    const { principal } = usePrincipalState();

    const scrollToBottom = () => {
        const el = scrollerRef.current;
        if (!el) return;

        el.scrollTop = el.scrollHeight;
        requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
            bottomRef.current?.scrollIntoView({
                block: "end",
                behavior: "auto",
            });
        });
    };

    const {
        data: messageResp,
        isLoading: messageLoading,
        error: messageError,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["getMessageListInfiniteRequest", { roomId, userId: principal?.userId, limit: 20 }],
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
        const el = scrollerRef.current;
        if (!el) return;

        if (needAdjustRef.current) return;

        const nearBottomNow =
            el.scrollHeight - (el.scrollTop + el.clientHeight) < 120;

        if (!didInitScrollRef.current && messageList.length > 0) {
            didInitScrollRef.current = true;
            scrollToBottom();
            return;
        }

        if (nearBottomNow) {
            scrollToBottom();
        }
    }, [messageList[0]?.messageId]);

    if (messageLoading) return <Loading />;
    if (messageError) return <ErrorComponent error={messageError} />;

    return (
        <Box
            ref={scrollerRef}
            onScroll={handleScroll}
            sx={{
                height: "100%",
                overflowY: "auto",
                minHeight: 0,
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
            }}>
            <Box
                sx={{
                    flex: 1,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                }}>
                {isFetchingNextPage && <ClipLoader />}

                {[...messageList].reverse().map((msg) => (
                    <MessageBubbleComponent key={msg.messageId} message={msg} />
                ))}

                <div ref={bottomRef} />
            </Box>
        </Box>
    );
}

export default MessageBubble;
