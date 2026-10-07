const pool = require("../config/database");

async function findAllDiscounts(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            discount_id,
            school_id,
            name,
            description,
            discount_type,
            value,
            valid_from,
            valid_to
        FROM discounts
        WHERE school_id = ?
        ORDER BY discount_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findDiscountById(discountId, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            discount_id,
            school_id,
            name,
            description,
            discount_type,
            value,
            valid_from,
            valid_to
        FROM discounts
        WHERE discount_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [discountId, schoolId]
    );

    return rows[0] || null;
}

async function findDiscountByName(name, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            discount_id
        FROM discounts
        WHERE name = ?
          AND school_id = ?
        LIMIT 1
        `,
        [name, schoolId]
    );

    return rows[0] || null;
}

async function createDiscount({
    schoolId,
    name,
    description,
    discountType,
    value,
    validFrom,
    validTo
}) {
    const [result] = await pool.query(
        `
        INSERT INTO discounts (
            school_id,
            name,
            description,
            discount_type,
            value,
            valid_from,
            valid_to
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            name,
            description || null,
            discountType,
            value,
            validFrom || null,
            validTo || null
        ]
    );

    return result.insertId;
}

async function updateDiscount(
    discountId,
    schoolId,
    {
        name,
        description,
        discountType,
        value,
        validFrom,
        validTo
    }
) {
    const [result] = await pool.query(
        `
        UPDATE discounts
        SET
            name = ?,
            description = ?,
            discount_type = ?,
            value = ?,
            valid_from = ?,
            valid_to = ?
        WHERE discount_id = ?
          AND school_id = ?
        `,
        [
            name,
            description || null,
            discountType,
            value,
            validFrom || null,
            validTo || null,
            discountId,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deleteDiscount(discountId, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM discounts
        WHERE discount_id = ?
          AND school_id = ?
        `,
        [discountId, schoolId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllDiscounts,
    findDiscountById,
    findDiscountByName,
    createDiscount,
    updateDiscount,
    deleteDiscount
};