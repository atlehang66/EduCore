const notificationService = require("../services/notification.service");

async function getNotifications(req, res, next) {
    try {
        const result = await notificationService.getAllNotifications(
            req.user.school_id,
            req.user.user_id
        );

        return res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
}

async function getNotificationById(req, res, next) {
    try {
        const { id } = req.params;

        const result = await notificationService.getNotificationById(
            id,
            req.user.school_id,
            req.user.user_id
        );

        return res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
}

async function createNotification(req, res, next) {
    try {
        const {
            user_id,
            title,
            message,
            type
        } = req.body;

        const result = await notificationService.createNotification({
            schoolId: req.user.school_id,
            userId: user_id,
            title,
            message,
            type
        });

        return res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
}

async function markNotificationRead(req, res, next) {
    try {
        const { id } = req.params;

        const result = await notificationService.markNotificationRead(
            id,
            req.user.school_id,
            req.user.user_id
        );

        return res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
}

async function markAllNotificationsRead(req, res, next) {
    try {
        const result = await notificationService.markAllNotificationsRead(
            req.user.school_id,
            req.user.user_id
        );

        return res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
}

async function deleteNotification(req, res, next) {
    try {
        const { id } = req.params;

        const result = await notificationService.deleteNotification(
            id,
            req.user.school_id,
            req.user.user_id
        );

        return res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getNotifications,
    getNotificationById,
    createNotification,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
};