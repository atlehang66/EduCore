const documentRepository = require("../repositories/document.repository");

async function getAllDocuments(schoolId) {
    const rows = await documentRepository.findAllDocuments(schoolId);
    return { success: true, statusCode: 200, data: { documents: rows } };
}

async function getDocumentById(id, schoolId) {
    const doc = await documentRepository.findDocumentById(id, schoolId);
    if (!doc) return { success: false, statusCode: 404, message: "Document not found" };
    return { success: true, statusCode: 200, data: { document: doc } };
}

async function createDocument(schoolId, { title, description, file_id, uploaded_by, uploaded_at }) {
    if (!title) return { success: false, statusCode: 400, message: "title is required" };
    const id = await documentRepository.createDocument({ schoolId, title, description, fileId: file_id, uploadedBy: uploaded_by, uploadedAt: uploaded_at });
    const created = await documentRepository.findDocumentById(id, schoolId);
    return { success: true, statusCode: 201, data: { document: created } };
}

async function updateDocument(id, schoolId, { title, description, file_id }) {
    const existing = await documentRepository.findDocumentById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Document not found" };
    await documentRepository.updateDocument(id, schoolId, { title: title || existing.title, description, fileId: file_id });
    const updated = await documentRepository.findDocumentById(id, schoolId);
    return { success: true, statusCode: 200, data: { document: updated } };
}

async function deleteDocument(id, schoolId) {
    const existing = await documentRepository.findDocumentById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Document not found" };
    await documentRepository.deleteDocument(id, schoolId);
    return { success: true, statusCode: 200, message: "Document deleted successfully" };
}

module.exports = { getAllDocuments, getDocumentById, createDocument, updateDocument, deleteDocument };