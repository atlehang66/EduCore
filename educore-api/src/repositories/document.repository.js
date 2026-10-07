const pool = require("../config/database");

async function findAllDocuments(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            document_id,
            school_id,
            student_id,
            file_id,
            title,
            category,
            uploaded_by,
            uploaded_at
        FROM documents
        WHERE school_id = ?
        ORDER BY document_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findDocumentById(documentId, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            document_id,
            school_id,
            student_id,
            file_id,
            title,
            category,
            uploaded_by,
            uploaded_at
        FROM documents
        WHERE document_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [documentId, schoolId]
    );

    return rows[0] || null;
}

async function createDocument({
    schoolId,
    studentId,
    fileId,
    title,
    category,
    uploadedBy
}) {
    const [result] = await pool.query(
        `
        INSERT INTO documents (
            school_id,
            student_id,
            file_id,
            title,
            category,
            uploaded_by
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            studentId || null,
            fileId,
            title,
            category || null,
            uploadedBy || null
        ]
    );

    return result.insertId;
}

async function updateDocument(
    documentId,
    schoolId,
    { studentId, fileId, title, category }
) {
    const [result] = await pool.query(
        `
        UPDATE documents
        SET
            student_id = ?,
            file_id = ?,
            title = ?,
            category = ?
        WHERE document_id = ?
          AND school_id = ?
        `,
        [
            studentId || null,
            fileId,
            title,
            category || null,
            documentId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteDocument(documentId, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM documents
        WHERE document_id = ?
          AND school_id = ?
        `,
        [documentId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllDocuments,
    findDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
};