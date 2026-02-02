import { instance } from "../utils/instance";

export const addRoomRequest = async (data) => {
    const result = await instance.post("/chat/room/add", data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getRoomListByUserIdRequest = async (userId) => {
    const result = await instance.get(`/chat/room/list/${userId}`);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getRoomByRoomIdRequest = async (roomId) => {
    const result = await instance.get(`/chat/room/${roomId}`);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const quitRoomRequest = async (data) => {
    const result = await instance.post("/chat/room/quit", data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeRoomTitleRequest = async (data) => {
    const result = await instance.post("/chat/room/change/title", data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const addRoomParticipantRequest = async (data) => {
    const result = await instance.post("/chat/room/participant/add", data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const addMessageRequest = async (data) => {
    const result = await instance.post("/chat/message/add", data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeMessageRequest = async (data) => {
    const result = await instance.post("/chat/message/change", data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const deleteMessageRequest = async (messageId) => {
    const result = await instance.post(`/chat/message/delete/${messageId}`);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getMessageListInfiniteRequest = async ({
    pageParam,
    queryKey,
}) => {
    const [_key, params] = queryKey;

    const requestData = {
        ...params,
        ...(pageParam ?? {}),
    };

    const result = await instance.get("/chat/message/list", {
        params: requestData,
    });

    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const countUnreadChatByUserIdRequest = async (userId) => {
    const result = await instance.get(`/chat/message/unread/${userId}`);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const muteNotificationRequest = async (data) => {
    const result = await instance.post(`/chat/mute/notification`, data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const changeRoomFavoriteRequest = async (data) => {
    const result = await instance.post(`/chat/change/favorite`, data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};