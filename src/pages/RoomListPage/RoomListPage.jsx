import { useEffect, useState } from "react";
import RoomList from "./RoomList";
import NewChatDialog from "./NewChatDialog";
import RoomListHeader from "./RoomListHeader";
import { Container } from "@mui/system";
import Loading from "../../components/Loading";
import ErrorComponent from "../../components/ErrorComponent";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useQuery } from "@tanstack/react-query";
import { getRoomListByUserIdRequest } from "../../apis/chat/chatApi";

function RoomListPage() {
    const [searchInputValue, setSearchInputValue] = useState("");
    const [isNewChat, setIsNewChat] = useState(false);
    const { principal } = usePrincipalState();
    const [roomList, setRoomList] = useState([]);

    const { data, isLoading, error } = useQuery({
        queryFn: () => getRoomListByUserIdRequest(principal.userId),
        queryKey: ["getRoomListByUserIdRequest", principal?.userId],
    });

    useEffect(() => {
        if (!data) return;
        setRoomList(data?.data.filter((room) => room.title.includes(searchInputValue)))
    }, [data, searchInputValue])

    if (isLoading) return <Loading />;
    if (error) return <ErrorComponent error={error} />;

    return (
        <Container>
            <RoomListHeader
                setIsNewChat={setIsNewChat}
                setSearchInputValue={setSearchInputValue}
                searchInputValue={searchInputValue}
            />

            <NewChatDialog
                isNewChat={isNewChat}
                setIsNewChat={setIsNewChat}
            />

            <RoomList roomList={roomList} />
        </Container>
    );
}

export default RoomListPage;
