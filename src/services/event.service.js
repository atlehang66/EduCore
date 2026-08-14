const eventRepository = require("../repositories/event.repository");

async function getAllEvents(schoolId) {
    const rows = await eventRepository.findAllEvents(schoolId);
    return { success: true, statusCode: 200, data: { events: rows } };
}

async function getEventById(id, schoolId) {
    const ev = await eventRepository.findEventById(id, schoolId);
    if (!ev) return { success: false, statusCode: 404, message: "Event not found" };
    return { success: true, statusCode: 200, data: { event: ev } };
}

async function createEvent(schoolId, { title, description, start_at, end_at, location }) {
    if (!title) return { success: false, statusCode: 400, message: "title is required" };
    const id = await eventRepository.createEvent({ schoolId, title, description, startAt: start_at, endAt: end_at, location });
    const created = await eventRepository.findEventById(id, schoolId);
    return { success: true, statusCode: 201, data: { event: created } };
}

async function updateEvent(id, schoolId, payload) {
    const existing = await eventRepository.findEventById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Event not found" };
    await eventRepository.updateEvent(id, schoolId, { title: payload.title || existing.title, description: payload.description, startAt: payload.start_at, endAt: payload.end_at, location: payload.location });
    const updated = await eventRepository.findEventById(id, schoolId);
    return { success: true, statusCode: 200, data: { event: updated } };
}

async function deleteEvent(id, schoolId) {
    const existing = await eventRepository.findEventById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Event not found" };
    await eventRepository.deleteEvent(id, schoolId);
    return { success: true, statusCode: 200, message: "Event deleted successfully" };
}

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };