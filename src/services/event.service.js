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

async function createEvent(
    schoolId,
    {
        title,
        description,
        eventDate,
        startTime,
        endTime,
        location,
        audience
    }
) {
    if (!title) {
        return {
            success: false,
            statusCode: 400,
            message: "title is required"
        };
    }

    if (!eventDate) {
        return {
            success: false,
            statusCode: 400,
            message: "eventDate is required"
        };
    }

    const eventId = await eventRepository.createEvent({
        schoolId,
        title,
        description,
        eventDate,
        startTime,
        endTime,
        location,
        audience
    });

    const created = await eventRepository.findEventById(
        eventId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            event: created
        }
    };
}
async function updateEvent(
    id,
    schoolId,
    {
        title,
        description,
        eventDate,
        startTime,
        endTime,
        location,
        audience
    }
) {
    const existing = await eventRepository.findEventById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Event not found"
        };
    }

    await eventRepository.updateEvent(
        id,
        schoolId,
        {
            title: title ?? existing.title,
            description: description ?? existing.description,
            eventDate: eventDate ?? existing.event_date,
            startTime: startTime ?? existing.start_time,
            endTime: endTime ?? existing.end_time,
            location: location ?? existing.location,
            audience: audience ?? existing.audience
        }
    );

    const updated = await eventRepository.findEventById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            event: updated
        }
    };
}

async function deleteEvent(id, schoolId) {
    const existing = await eventRepository.findEventById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Event not found" };
    await eventRepository.deleteEvent(id, schoolId);
    return { success: true, statusCode: 200, message: "Event deleted successfully" };
}

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };