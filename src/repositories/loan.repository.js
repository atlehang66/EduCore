const pool = require("../config/database");

async function findAllLoans(schoolId) {
    const [rows] = await pool.query(
        `SELECT loan_id, school_id, book_id, student_id, loaned_at, due_at, returned_at, status, created_at, updated_at FROM loans WHERE school_id = ? ORDER BY loan_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findLoanById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT loan_id, school_id, book_id, student_id, loaned_at, due_at, returned_at, status, created_at, updated_at FROM loans WHERE loan_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createLoan({ schoolId, bookId, studentId, loanedAt, dueAt, status }) {
    const [result] = await pool.query(
        `INSERT INTO loans (school_id, book_id, student_id, loaned_at, due_at, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, bookId, studentId, loanedAt || null, dueAt || null, status || 'loaned']
    );
    return result.insertId;
}

async function updateLoan(id, schoolId, { returnedAt, status }) {
    const [result] = await pool.query(
        `UPDATE loans SET returned_at = ?, status = ? WHERE loan_id = ? AND school_id = ?`,
        [returnedAt || null, status || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteLoan(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM loans WHERE loan_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = { findAllLoans, findLoanById, createLoan, updateLoan, deleteLoan };