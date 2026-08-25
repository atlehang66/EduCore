const notificationRepo = require("../repositories/notification.repository");

async function getAllNotifications(schoolId, userId) {
    const rows = await notificationRepo.findAllNotifications(
        schoolId,
        userId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            notifications: rows
        }
    };
}

async function getNotificationById(id, schoolId, userId) {
    const notification = await notificationRepo.findNotificationById(
        id,
        schoolId,
        userId
    );

    if (!notification) {
        return {
            success: false,
            statusCode: 404,
            message: "Notification not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            notification
        }
    };
}

async function createNotification({
    schoolId,
    userId,
    title,
    message,
    type
}) {
    if (!userId) {
        return {
            success: false,
            statusCode: 400,
            message: "User ID is required"
        };
    }

    if (!title) {
        return {
            success: false,
            statusCode: 400,
            message: "Notification title is required"
        };
    }

    if (!message) {
        return {
            success: false,
            statusCode: 400,
            message: "Notification message is required"
        };
    }

    const id = await notificationRepo.createNotification({
        schoolId,
        userId,
        title,
        message,
        type
    });

    const created = await notificationRepo.findNotificationById(
        id,
        schoolId,
        userId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            notification: created
        }
    };
}

async function markNotificationRead(id, schoolId, userId) {
    const updated = await notificationRepo.markRead(
        id,
        schoolId,
        userId
    );

    if (!updated) {
        return {
            success: false,
            statusCode: 404,
            message: "Notification not found"
        };
    }

    const notification = await notificationRepo.findNotificationById(
        id,
        schoolId,
        userId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            notification
        }
    };
}

async function markAllNotificationsRead(schoolId, userId) {
    const count = await notificationRepo.markAllRead(
        schoolId,
        userId
    );

    return {
        success: true,
        statusCode: 200,
        message: "All notifications marked as read",
        data: {
            updated: count
        }
    };
}

async function deleteNotification(id, schoolId, userId) {
    const deleted = await notificationRepo.deleteNotification(
        id,
        schoolId,
        userId
    );

    if (!deleted) {
        return {
            success: false,
            statusCode: 404,
            message: "Notification not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        message: "Notification deleted successfully"
    };
}

module.exports = {
    getAllNotifications,
    getNotificationById,
    createNotification,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
};