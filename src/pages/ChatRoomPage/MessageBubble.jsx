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

const STICK_THRESHOLD = 120;

const MessageBubble = forwardRef(function MessageBubble({ roomId }, ref) {
    const scrollerRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const needAdjustRef = useRef(false);
    const didInitScrollRef = useRef(false);
    const shouldStickToBottomRef = useRef(true);

    const anchorBottomGapRef = useRef(null);
    const keyboardAnchorActiveRef = useRef(false);

    const { principal } = usePrincipalState();

    const isNearBottom = () => {
        const el = scrollerRef.current;
        if (!el) return true;
        return (
            el.scrollHeight - (el.scrollTop + el.clientHeight) < STICK_THRESHOLD
        );
    };

    const scrollToBottom = () => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    };

    useImperativeHandle(ref, () => ({
        isNearBottom,
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

    const newestId = messageList.length
        ? messageList[messageList.length - 1].messageId
        : null;

    const handleScroll = () => {
        const el = scrollerRef.current;
        if (!el) return;

        shouldStickToBottomRef.current = isNearBottom();

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

        if (!didInitScrollRef.current && messageList.length > 0) {
            didInitScrollRef.current = true;
            scrollToBottom();
            return;
        }

        if (shouldStickToBottomRef.current) {
            requestAnimationFrame(scrollToBottom);
        }
    }, [newestId]);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        let raf = 0;

        const getBottomGap = () => {
            const el = scrollerRef.current;
            if (!el) return 0;
            return el.scrollHeight - (el.scrollTop + el.clientHeight);
        };

        const restoreByBottomGap = () => {
            const el = scrollerRef.current;
            if (!el) return;

            shouldStickToBottomRef.current = isNearBottom();

            if (shouldStickToBottomRef.current) {
                scrollToBottom();
                return;
            }

            const gap = anchorBottomGapRef.current;
            if (gap == null) return;

            const nextTop = el.scrollHeight - el.clientHeight - gap;
            el.scrollTop = Math.max(0, nextTop);
        };

        const onFocusIn = (e) => {
            const t = e.target;
            if (!(t instanceof HTMLElement)) return;

            const isInput =
                t.tagName === "INPUT" ||
                t.tagName === "TEXTAREA" ||
                t.isContentEditable;

            if (!isInput) return;

            keyboardAnchorActiveRef.current = true;
            anchorBottomGapRef.current = getBottomGap();
        };

        const onFocusOut = () => {
            window.setTimeout(() => {
                keyboardAnchorActiveRef.current = false;
                anchorBottomGapRef.current = null;
            }, 250);
        };

        const onVV = () => {
            if (!keyboardAnchorActiveRef.current) return;

            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                restoreByBottomGap();
            });
        };

        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", onFocusOut);
        vv.addEventListener("resize", onVV);
        vv.addEventListener("scroll", onVV);

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener("focusin", onFocusIn);
            document.removeEventListener("focusout", onFocusOut);
            vv.removeEventListener("resize", onVV);
            vv.removeEventListener("scroll", onVV);
        };
    }, []);

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
                    justifyContent: "flex-end",
                    minHeight: "100%",
                }}>
                {isFetchingNextPage && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <ClipLoader />
                    </Box>
                )}

                {[...messageList].reverse().map((msg) => (
                    <MessageBubbleComponent key={msg.messageId} message={msg} />
                ))}
            </Box>
        </Box>
    );
});

export default MessageBubble;
