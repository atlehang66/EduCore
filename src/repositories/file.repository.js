const pool = require("../config/database");

async function findAllFiles(schoolId) {
    const [rows] = await pool.query(
        `SELECT file_id, school_id, filename, path, mime_type, size, uploaded_by, uploaded_at FROM files WHERE school_id = ? ORDER BY file_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findFileById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT file_id, school_id, filename, path, mime_type, size, uploaded_by, uploaded_at FROM files WHERE file_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createFile({ schoolId, filename, path, mimeType, size, uploadedBy, uploadedAt }) {
    const [result] = await pool.query(
        `INSERT INTO files (school_id, filename, path, mime_type, size, uploaded_by, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [schoolId, filename, path, mimeType || null, size || null, uploadedBy || null, uploadedAt || null]
    );
    return result.insertId;
}

async function deleteFile(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM files WHERE file_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = { findAllFiles, findFileById, createFile, deleteFile };