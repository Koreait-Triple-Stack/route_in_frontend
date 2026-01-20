import { instance } from "../utils/instance";

export const addNotificationRequest = async (data) => {
    return instance.post("/notification/add", data);
};

export const getNotificationListByUserIdRequest = async (userId) => {
    return instance.get(`/notification/get/list/${userId}`);
};

export const deleteNotificationByNotificationIdRequest = async (
    notificationId,
) => {
    return instance.post(`/notification/delete/${notificationId}`);
};

export const deleteNotificationByUserIdRequest = async (userId) => {
    return instance.post(`/notification/delete/all/${userId}`);
};

export const testNotificationRequest = async (data) => {
    return instance.post("/notification/test", data);
};
