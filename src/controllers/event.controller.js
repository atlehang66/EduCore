const eventService = require("../services/event.service");

async function getEvents(req, res, next) {
    try {
        const result = await eventService.getAllEvents(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getEventById(req, res, next) {
    try {
        const result = await eventService.getEventById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createEvent(req, res, next) {
    try {
        const { title, description, start_at, end_at, location } = req.body;
        const result = await eventService.createEvent(req.user.school_id, { title, description, start_at, end_at, location });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateEvent(req, res, next) {
    try {
        const payload = req.body;
        const result = await eventService.updateEvent(req.params.id, req.user.school_id, payload);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteEvent(req, res, next) {
    try {
        const result = await eventService.deleteEvent(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };