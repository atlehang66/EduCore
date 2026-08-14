const messageService = require("../services/message.service");

async function getMessages(req, res, next) {
    try {
        const result = await messageService.getAllMessages(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getMessageById(req, res, next) {
    try {
        const result = await messageService.getMessageById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createMessage(req, res, next) {
    try {
        const { sender_id, recipient_id, subject, body, sent_at } = req.body;
        const result = await messageService.createMessage(req.user.school_id, { sender_id, recipient_id, subject, body, sent_at });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function markRead(req, res, next) {
    try {
        const result = await messageService.markMessageRead(req.params.id, req.user.school_id, req.body.read_at);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteMessage(req, res, next) {
    try {
        const result = await messageService.deleteMessage(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getMessages, getMessageById, createMessage, markRead, deleteMessage };