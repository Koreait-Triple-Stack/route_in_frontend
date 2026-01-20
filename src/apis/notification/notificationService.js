import {
    addNotificationRequest,
    countUnreadNotificationByUserIdRequest,
    deleteNotificationByNotificationIdRequest,
    deleteNotificationByUserIdRequest,
    getNotificationListByUserIdRequest,
} from "./notificationApi";

export const addNotification = async (boardId) => {
    const result = await addNotificationRequest(boardId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const getNotificationListByUserId = async (userId) => {
    const result = await getNotificationListByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const deleteNotificationByNotificationId = async (userId) => {
    const result = await deleteNotificationByNotificationIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const deleteNotificationByUserId = async (data) => {
    const result = await deleteNotificationByUserIdRequest(data);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};

export const countUnreadNotificationByUserId = async (userId) => {
    const result = await countUnreadNotificationByUserIdRequest(userId);
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};
