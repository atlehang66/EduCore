const brandingRepository = require("../repositories/branding.repository");

async function getBranding(schoolId) {
    const rows = await brandingRepository.findBrandingBySchoolId(schoolId);
    return { success: true, statusCode: 200, data: { branding: rows } };
}

async function getBrandingById(brandingId, schoolId) {
    const b = await brandingRepository.findBrandingById(brandingId, schoolId);
    if (!b) return { success: false, statusCode: 404, message: "Branding not found" };
    return { success: true, statusCode: 200, data: { branding: b } };
}

async function createBranding({ schoolId, logoUrl, faviconUrl, themeColor, primaryFont, secondaryFont }) {
    // Basic validation: none required; allow creation
    const brandingId = await brandingRepository.createBranding({ schoolId, logoUrl, faviconUrl, themeColor, primaryFont, secondaryFont });
    const b = await brandingRepository.findBrandingById(brandingId, schoolId);
    return { success: true, statusCode: 201, data: { branding: b } };
}

async function updateBranding(brandingId, schoolId, { logoUrl, faviconUrl, themeColor, primaryFont, secondaryFont }) {
    const existing = await brandingRepository.findBrandingById(brandingId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Branding not found" };

    await brandingRepository.updateBranding(brandingId, schoolId, { logoUrl, faviconUrl, themeColor, primaryFont, secondaryFont });
    const b = await brandingRepository.findBrandingById(brandingId, schoolId);
    return { success: true, statusCode: 200, data: { branding: b } };
}

async function deleteBranding(brandingId, schoolId) {
    const existing = await brandingRepository.findBrandingById(brandingId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Branding not found" };

    await brandingRepository.deleteBranding(brandingId, schoolId);
    return { success: true, statusCode: 200, message: "Branding deleted successfully" };
}

module.exports = {
    getBranding,
    getBrandingById,
    createBranding,
    updateBranding,
    deleteBranding
};