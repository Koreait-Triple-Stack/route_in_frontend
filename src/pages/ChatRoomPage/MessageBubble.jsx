import { Box } from "@mui/system";
import { getMessageListInfiniteRequest } from "../../apis/chat/chatApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import MessageBubbleComponent from "./MessageBubbleComponent";
import { ClipLoader } from "react-spinners";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePrincipalState } from "../../store/usePrincipalState";

function MessageBubble({ roomId, scrollerRef }) {
    const prevScrollHeightRef = useRef(0);
    const needAdjustRef = useRef(false);
    const didInitScrollRef = useRef(false);
    const keepAtBottomRef = useRef(true);
    const fetchLockRef = useRef(false);

    const bottomRef = useRef(null);

    const { principal } = usePrincipalState();

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
        enabled: !!roomId && !!principal?.userId,
    });

    const messageList =
        messageResp?.pages?.flatMap((p) => p?.data?.messageList ?? []) ?? [];

    const scrollToBottom = (behavior = "auto") => {
        const el = scrollerRef?.current;
        if (!el) return;

        const go = () =>
            bottomRef.current?.scrollIntoView({ block: "end", behavior });

        go();
        requestAnimationFrame(go);
        setTimeout(go, 50);
    };

    useEffect(() => {
        const el = scrollerRef?.current;
        if (!el) return;

        const onScroll = () => {
            if (needAdjustRef.current) return;

            const nearBottom =
                el.scrollHeight - (el.scrollTop + el.clientHeight) < 120;
            keepAtBottomRef.current = nearBottom;

            if (!didInitScrollRef.current) return;
            if (fetchLockRef.current) return;

            if (el.scrollTop <= 20 && hasNextPage && !isFetchingNextPage) {
                prevScrollHeightRef.current = el.scrollHeight;
                needAdjustRef.current = true;
                fetchLockRef.current = true;

                fetchNextPage().finally(() => {
                    setTimeout(() => {
                        fetchLockRef.current = false;
                    }, 300);
                });
            }
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [scrollerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const el = scrollerRef?.current;
        if (!el) return;
        if (!needAdjustRef.current) return;

        const prevH = prevScrollHeightRef.current;
        const diff = el.scrollHeight - prevH;
        el.scrollTop = el.scrollTop + diff;

        needAdjustRef.current = false;
        prevScrollHeightRef.current = 0;
        fetchLockRef.current = false;
    }, [messageList.length, scrollerRef]);

    useLayoutEffect(() => {
        if (!messageList.length) return;

        if (!didInitScrollRef.current) {
            didInitScrollRef.current = true;
            scrollToBottom("auto");
            return;
        }

        if (keepAtBottomRef.current) {
            scrollToBottom("auto");
        }
    }, [messageList[0]?.messageId, messageList.length]);

    if (messageLoading) return <Loading />;
    if (messageError) return <ErrorComponent error={messageError} />;

    return (
        <Box
            sx={{
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
    );
}

export default MessageBubble;
