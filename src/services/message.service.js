const messageRepo = require("../repositories/message.repository");

async function getAllMessages(schoolId) {
    const rows = await messageRepo.findAllMessages(schoolId);
    return { success: true, statusCode: 200, data: { messages: rows } };
}

async function getMessageById(id, schoolId) {
    const m = await messageRepo.findMessageById(id, schoolId);
    if (!m) return { success: false, statusCode: 404, message: "Message not found" };
    return { success: true, statusCode: 200, data: { message: m } };
}

async function createMessage(schoolId, { sender_id, recipient_id, subject, body, sent_at }) {
    if (!recipient_id) return { success: false, statusCode: 400, message: "recipient_id is required" };
    const id = await messageRepo.createMessage({ schoolId, senderId: sender_id, recipientId: recipient_id, subject, body, sentAt: sent_at });
    const created = await messageRepo.findMessageById(id, schoolId);
    return { success: true, statusCode: 201, data: { message: created } };
}

async function markMessageRead(id, schoolId, readAt) {
    const existing = await messageRepo.findMessageById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Message not found" };
    await messageRepo.markRead(id, schoolId, readAt);
    const updated = await messageRepo.findMessageById(id, schoolId);
    return { success: true, statusCode: 200, data: { message: updated } };
}

async function deleteMessage(id, schoolId) {
    const existing = await messageRepo.findMessageById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Message not found" };
    await messageRepo.deleteMessage(id, schoolId);
    return { success: true, statusCode: 200, message: "Message deleted successfully" };
}

module.exports = { getAllMessages, getMessageById, createMessage, markMessageRead, deleteMessage };