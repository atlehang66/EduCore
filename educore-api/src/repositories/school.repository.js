const pool = require("../config/database");

async function findAllSchools() {
    const [rows] = await pool.execute(
        `
        SELECT
            school_id,
            name,
            code,
            address,
            phone,
            email,
            website,
            timezone,
            created_at,
            updated_at
        FROM schools
        ORDER BY school_id DESC
        `
    );

    return rows;
}

async function findSchoolById(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            school_id,
            name,
            code,
            address,
            phone,
            email,
            website,
            timezone,
            created_at,
            updated_at
        FROM schools
        WHERE school_id = ?
        LIMIT 1
        `,
        [schoolId]
    );

    return rows[0] || null;
}

async function findSchoolByName(name) {
    const [rows] = await pool.execute(
        `
        SELECT school_id FROM schools WHERE name = ? LIMIT 1
        `,
        [name]
    );

    return rows[0] || null;
}

async function createSchool({ name, code, address, phone, email, website, timezone }) {
    const [result] = await pool.execute(
        `
        INSERT INTO schools (
            name,
            code,
            address,
            phone,
            email,
            website,
            timezone
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            name,
            code || null,
            address || null,
            phone || null,
            email || null,
            website || null,
            timezone || null
        ]
    );

    return result.insertId;
}

async function updateSchool(schoolId, { name, code, address, phone, email, website, timezone }) {
    const [result] = await pool.execute(
        `
        UPDATE schools
        SET
            name = ?,
            code = ?,
            address = ?,
            phone = ?,
            email = ?,
            website = ?,
            timezone = ?
        WHERE school_id = ?
        `,
        [
            name,
            code || null,
            address || null,
            phone || null,
            email || null,
            website || null,
            timezone || null,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteSchool(schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM schools
        WHERE school_id = ?
        `,
        [schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllSchools,
    findSchoolById,
    findSchoolByName,
    createSchool,
    updateSchool,
    deleteSchool
};