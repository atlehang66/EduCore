const notificationService = require("../services/notification.service");

async function getNotifications(req, res, next) {
    try {
        const result = await notificationService.getAllNotifications(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getNotificationById(req, res, next) {
    try {
        const result = await notificationService.getNotificationById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createNotification(req, res, next) {
    try {
        const { user_id, title, message } = req.body;
        const result = await notificationService.createNotification(req.user.school_id, { user_id, title, message });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function markRead(req, res, next) {
    try {
        const result = await notificationService.markNotificationRead(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteNotification(req, res, next) {
    try {
        const result = await notificationService.deleteNotification(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getNotifications, getNotificationById, createNotification, markRead, deleteNotification };