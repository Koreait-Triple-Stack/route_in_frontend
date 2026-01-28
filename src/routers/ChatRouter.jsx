import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatRoomPage from "../pages/ChatRoomPage/ChatRoomPage";
import RoomListPage from "../pages/RoomListPage/RoomListPage";

export default function ChatRouter() {
    return (
        <Routes>
            <Route path="/" element={<RoomListPage />} />
            <Route path="/room/:roomId" element={<ChatRoomPage />} />
        </Routes>
    );
}