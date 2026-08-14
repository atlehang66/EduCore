const pool = require("../config/database");

async function findAllAcademicYears(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            academic_year_id,
            school_id,
            name,
            start_date,
            end_date,
            is_current
        FROM academic_years
        WHERE school_id = ?
        ORDER BY start_date DESC
        `,
        [schoolId]
    );

    return rows;
}
async function findAcademicYearById(academicYearId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            academic_year_id,
            school_id,
            name,
            start_date,
            end_date,
            is_current
        FROM academic_years
        WHERE academic_year_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [academicYearId, schoolId]
    );

    return rows[0] || null;
}
async function createAcademicYear({
    schoolId,
    name,
    startDate,
    endDate,
    isCurrent
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO academic_years
        (
            school_id,
            name,
            start_date,
            end_date,
            is_current
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            name,
            startDate,
            endDate,
            isCurrent ?? 0
        ]
    );

    return result.insertId;
}
async function updateAcademicYear(
    academicYearId,
    schoolId,
    {
        name,
        startDate,
        endDate,
        isCurrent
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE academic_years
        SET
            name = ?,
            start_date = ?,
            end_date = ?,
            is_current = ?
        WHERE academic_year_id = ?
          AND school_id = ?
        `,
        [
            name,
            startDate,
            endDate,
            isCurrent ?? 0,
            academicYearId,
            schoolId
        ]
    );

    return result.affectedRows;
}
async function deleteAcademicYear(academicYearId, schoolId) {
    try {
        const [result] = await pool.execute(
            `
            DELETE FROM academic_years
            WHERE academic_year_id = ?
              AND school_id = ?
            `,
            [academicYearId, schoolId]
        );

        return result.affectedRows;

    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            const conflictError = new Error(
                "Academic year cannot be deleted because it is being used by existing records"
            );

            conflictError.statusCode = 409;

            throw conflictError;
        }

        throw error;
    }
}
module.exports = {
    findAllAcademicYears,
    findAcademicYearById,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear
};