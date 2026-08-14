const notificationRepo = require("../repositories/notification.repository");

async function getAllNotifications(schoolId) {
    const rows = await notificationRepo.findAllNotifications(schoolId);
    return { success: true, statusCode: 200, data: { notifications: rows } };
}

async function getNotificationById(id, schoolId) {
    const n = await notificationRepo.findNotificationById(id, schoolId);
    if (!n) return { success: false, statusCode: 404, message: "Notification not found" };
    return { success: true, statusCode: 200, data: { notification: n } };
}

async function createNotification(schoolId, { user_id, title, message }) {
    if (!title || !message) return { success: false, statusCode: 400, message: "title and message are required" };
    const id = await notificationRepo.createNotification({ schoolId, userId: user_id, title, message });
    const created = await notificationRepo.findNotificationById(id, schoolId);
    return { success: true, statusCode: 201, data: { notification: created } };
}

async function markNotificationRead(id, schoolId) {
    const existing = await notificationRepo.findNotificationById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Notification not found" };
    await notificationRepo.markRead(id, schoolId);
    const updated = await notificationRepo.findNotificationById(id, schoolId);
    return { success: true, statusCode: 200, data: { notification: updated } };
}

async function deleteNotification(id, schoolId) {
    const existing = await notificationRepo.findNotificationById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Notification not found" };
    await notificationRepo.deleteNotification(id, schoolId);
    return { success: true, statusCode: 200, message: "Notification deleted successfully" };
}

module.exports = { getAllNotifications, getNotificationById, createNotification, markNotificationRead, deleteNotification };