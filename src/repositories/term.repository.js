const pool = require("../config/database");

async function findAllTerms(academicYearId) {
    const [rows] = await pool.execute(
        `
        SELECT
            term_id,
            academic_year_id,
            name,
            start_date,
            end_date,
            term_order
        FROM terms
        WHERE academic_year_id = ?
        ORDER BY term_order ASC
        `,
        [academicYearId]
    );

    return rows;
}

async function findTermById(termId, academicYearId) {
    const [rows] = await pool.execute(
        `
        SELECT
            term_id,
            academic_year_id,
            name,
            start_date,
            end_date,
            term_order
        FROM terms
        WHERE term_id = ?
          AND academic_year_id = ?
        LIMIT 1
        `,
        [termId, academicYearId]
    );

    return rows[0] || null;
}
async function createTerm({
    academicYearId,
    name,
    startDate,
    endDate,
    termOrder
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO terms
        (
            academic_year_id,
            name,
            start_date,
            end_date,
            term_order
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            academicYearId,
            name,
            startDate,
            endDate,
            termOrder
        ]
    );

    return result.insertId;
}
async function updateTerm(
    termId,
    academicYearId,
    {
        name,
        startDate,
        endDate,
        termOrder
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE terms
        SET
            name = ?,
            start_date = ?,
            end_date = ?,
            term_order = ?
        WHERE term_id = ?
          AND academic_year_id = ?
        `,
        [
            name,
            startDate,
            endDate,
            termOrder,
            termId,
            academicYearId
        ]
    );

    return result.affectedRows;
}
async function deleteTerm(termId, academicYearId) {
    const [result] = await pool.execute(
        `
        DELETE FROM terms
        WHERE term_id = ?
          AND academic_year_id = ?
        `,
        [termId, academicYearId]
    );

    return result.affectedRows;
}
module.exports = {
    findAllTerms,
    findTermById,
    createTerm,
    updateTerm,
    deleteTerm
};