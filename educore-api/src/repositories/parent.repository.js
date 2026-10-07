const pool = require("../config/database");

async function findAllParents(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            parent_id,
            school_id,
            user_id,
            first_name,
            last_name,
            phone,
            email,
            occupation,
            created_at
        FROM parents
        WHERE school_id = ?
        ORDER BY last_name ASC, first_name ASC
        `,
        [schoolId]
    );

    return rows;
}
async function findParentById(parentId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            parent_id,
            school_id,
            user_id,
            first_name,
            last_name,
            phone,
            email,
            occupation,
            created_at
        FROM parents
        WHERE parent_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [parentId, schoolId]
    );

    return rows[0] || null;
}
async function createParent({
    schoolId,
    userId,
    firstName,
    lastName,
    phone,
    email,
    occupation
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO parents (
            school_id,
            user_id,
            first_name,
            last_name,
            phone,
            email,
            occupation
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            userId || null,
            firstName,
            lastName,
            phone || null,
            email || null,
            occupation || null
        ]
    );

    return result.insertId;
}
async function updateParent(
    parentId,
    schoolId,
    {
        userId,
        firstName,
        lastName,
        phone,
        email,
        occupation
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE parents
        SET
            user_id = ?,
            first_name = ?,
            last_name = ?,
            phone = ?,
            email = ?,
            occupation = ?
        WHERE parent_id = ?
          AND school_id = ?
        `,
        [
            userId || null,
            firstName,
            lastName,
            phone || null,
            email || null,
            occupation || null,
            parentId,
            schoolId
        ]
    );

    return result.affectedRows;
}
async function deleteParent(parentId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM parents
        WHERE parent_id = ?
          AND school_id = ?
        `,
        [parentId, schoolId]
    );

    return result.affectedRows;
}
module.exports = {
    findAllParents,
    findParentById,
    createParent,
    updateParent,
    deleteParent
};