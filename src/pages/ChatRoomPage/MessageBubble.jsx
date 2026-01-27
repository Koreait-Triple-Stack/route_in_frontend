import { Box, Container } from "@mui/system";
import { Typography } from "@mui/material";
import { getMessageListInfiniteRequest } from "../../apis/chat/chatApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import MessageBubbleComponent from "./MessageBubbleComponent";

function MessageBubble({ scrollRef }) {
    const {
        data: messageResp,
        isLoading: messageLoading,
        error: messageError,
    } = useInfiniteQuery({
        queryKey: ["getMessageListInfiniteRequest", { roomId: 7, limit: 20 }],
        queryFn: getMessageListInfiniteRequest,
        initialPageParam: null,

        getNextPageParam: (lastPage) => {
            const d = lastPage.data;

            if (!d.hasNext) return undefined;

            return {
                cursorCreateDt: d.nextCursorCreateDt,
                cursorRoomId: d.nextCursorRoomId,
            };
        },
    });
    const messageList =
        messageResp?.pages?.flatMap((p) => p?.data?.messageList ?? []) ?? [];

    if (messageLoading) return <Loading />;
    if (messageError) return <ErrorComponent error={messageError} />;

    return (
        <Container sx={{ height: "100%" }}>
            {/* 📜 채팅 리스트 영역 */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                }}>
                {/* 날짜 구분선 예시 */}
                <Box sx={{ textAlign: "center", mb: 3, mt: 1 }}>
                    <Typography
                        sx={{
                            display: "inline-block",
                            bgcolor: "rgba(0,0,0,0.1)",
                            color: "#fff",
                            px: 2,
                            py: 0.5,
                            borderRadius: 10,
                            fontSize: "0.75rem",
                        }}>
                        2026년 1월 26일 월요일
                    </Typography>
                </Box>
                {messageList.reverse().map((msg) => (
                    <MessageBubbleComponent
                        key={msg.messageId}
                        message={msg}
                    />
                ))}
                <div ref={scrollRef} /> {/* 스크롤 하단 고정용 */}
            </Box>
        </Container>
    );
}

export default MessageBubble;
