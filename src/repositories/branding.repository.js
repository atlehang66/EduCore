const pool = require("../config/database");

async function findBrandingBySchoolId(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            branding_id,
            school_id,
            logo_url,
            favicon_url,
            theme_color,
            primary_font,
            secondary_font,
            created_at,
            updated_at
        FROM branding
        WHERE school_id = ?
        ORDER BY branding_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findBrandingById(brandingId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            branding_id,
            school_id,
            logo_url,
            favicon_url,
            theme_color,
            primary_font,
            secondary_font,
            created_at,
            updated_at
        FROM branding
        WHERE branding_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [brandingId, schoolId]
    );

    return rows[0] || null;
}

async function createBranding({ schoolId, logoUrl, faviconUrl, themeColor, primaryFont, secondaryFont }) {
    const [result] = await pool.execute(
        `
        INSERT INTO branding (
            school_id,
            logo_url,
            favicon_url,
            theme_color,
            primary_font,
            secondary_font
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            logoUrl || null,
            faviconUrl || null,
            themeColor || null,
            primaryFont || null,
            secondaryFont || null
        ]
    );

    return result.insertId;
}

async function updateBranding(brandingId, schoolId, { logoUrl, faviconUrl, themeColor, primaryFont, secondaryFont }) {
    const [result] = await pool.execute(
        `
        UPDATE branding
        SET
            logo_url = ?,
            favicon_url = ?,
            theme_color = ?,
            primary_font = ?,
            secondary_font = ?
        WHERE branding_id = ?
          AND school_id = ?
        `,
        [
            logoUrl || null,
            faviconUrl || null,
            themeColor || null,
            primaryFont || null,
            secondaryFont || null,
            brandingId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteBranding(brandingId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM branding
        WHERE branding_id = ?
          AND school_id = ?
        `,
        [brandingId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findBrandingBySchoolId,
    findBrandingById,
    createBranding,
    updateBranding,
    deleteBranding
};