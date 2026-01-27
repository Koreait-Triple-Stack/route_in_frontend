import React from "react";
import ChatListPage from "../pages/ChatPage/ChatPage";
import { Route, Routes } from "react-router-dom";
import ChatRoomPage from "../pages/ChatRoomPage/ChatRoomPage";

export default function ChatRouter() {
    return (
        <Routes>
            <Route path="/" element={<ChatListPage />} />
            <Route path="/room" element={<ChatRoomPage />} />
        </Routes>
    );
}