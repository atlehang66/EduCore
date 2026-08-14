const fileRepository = require("../repositories/file.repository");

async function getAllFiles(schoolId) {
    const rows = await fileRepository.findAllFiles(schoolId);
    return { success: true, statusCode: 200, data: { files: rows } };
}

async function getFileById(id, schoolId) {
    const f = await fileRepository.findFileById(id, schoolId);
    if (!f) return { success: false, statusCode: 404, message: "File not found" };
    return { success: true, statusCode: 200, data: { file: f } };
}

async function createFile(schoolId, { filename, path, mime_type, size, uploaded_by, uploaded_at }) {
    if (!filename || !path) return { success: false, statusCode: 400, message: "filename and path are required" };
    const id = await fileRepository.createFile({ schoolId, filename, path, mimeType: mime_type, size, uploadedBy: uploaded_by, uploadedAt: uploaded_at });
    const created = await fileRepository.findFileById(id, schoolId);
    return { success: true, statusCode: 201, data: { file: created } };
}

async function deleteFile(id, schoolId) {
    const existing = await fileRepository.findFileById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "File not found" };
    // check dependent documents
    const pool = require("../config/database");
    const [deps] = await pool.query(`SELECT 1 FROM documents WHERE file_id = ? LIMIT 1`, [id]);
    if (deps && deps.length > 0) return { success: false, statusCode: 409, message: "Cannot delete file referenced by documents" };
    await fileRepository.deleteFile(id, schoolId);
    return { success: true, statusCode: 200, message: "File deleted successfully" };
}

module.exports = { getAllFiles, getFileById, createFile, deleteFile };