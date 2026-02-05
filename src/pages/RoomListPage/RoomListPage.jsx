import { useMemo, useState } from "react";
import RoomList from "./RoomList";
import NewChatDialog from "./NewChatDialog";
import RoomListHeader from "./RoomListHeader";
import { Box } from "@mui/system";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useQuery } from "@tanstack/react-query";
import { getRoomListByUserIdRequest } from "../../apis/chat/chatApi";

function RoomListPage() {
    const [searchInputValue, setSearchInputValue] = useState("");
    const [isNewChat, setIsNewChat] = useState(false);
    const { principal } = usePrincipalState();

    const { data, isLoading, error } = useQuery({
        queryFn: () => getRoomListByUserIdRequest(principal.userId),
        queryKey: ["getRoomListByUserIdRequest", principal?.userId],
        enabled: !!principal?.userId,
        staleTime: 20000,
    });

    const rooms = data?.data ?? [];

    const filtered = useMemo(() => {
        const q = searchInputValue.trim();
        if (!q) return rooms;
        return rooms.filter((room) => (room.title ?? "").includes(q));
    }, [rooms, searchInputValue]);

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    return (
        <Box sx={{ px: 1, pb: 1.5 }}>
            <RoomListHeader
                setIsNewChat={setIsNewChat}
                setSearchInputValue={setSearchInputValue}
                searchInputValue={searchInputValue}
            />

            <NewChatDialog isNewChat={isNewChat} setIsNewChat={setIsNewChat} />

            <RoomList roomList={filtered} />
        </Box>
    );
}

export default RoomListPage;
