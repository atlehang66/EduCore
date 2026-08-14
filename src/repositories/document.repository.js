const pool = require("../config/database");

async function findAllDocuments(schoolId) {
    const [rows] = await pool.query(
        `SELECT document_id, school_id, title, description, file_id, uploaded_by, uploaded_at, created_at, updated_at FROM documents WHERE school_id = ? ORDER BY document_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findDocumentById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT document_id, school_id, title, description, file_id, uploaded_by, uploaded_at, created_at, updated_at FROM documents WHERE document_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createDocument({ schoolId, title, description, fileId, uploadedBy, uploadedAt }) {
    const [result] = await pool.query(
        `INSERT INTO documents (school_id, title, description, file_id, uploaded_by, uploaded_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, title, description || null, fileId || null, uploadedBy || null, uploadedAt || null]
    );
    return result.insertId;
}

async function updateDocument(id, schoolId, { title, description, fileId }) {
    const [result] = await pool.query(
        `UPDATE documents SET title = ?, description = ?, file_id = ? WHERE document_id = ? AND school_id = ?`,
        [title, description || null, fileId || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteDocument(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM documents WHERE document_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findAllDocuments,
    findDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
};