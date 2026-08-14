const brandingService = require("../services/branding.service");

async function getBranding(req, res, next) {
    try {
        const result = await brandingService.getBranding(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getBrandingById(req, res, next) {
    try {
        const result = await brandingService.getBrandingById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createBranding(req, res, next) {
    try {
        const { logo_url, favicon_url, theme_color, primary_font, secondary_font } = req.body;
        const result = await brandingService.createBranding({
            schoolId: req.user.school_id,
            logoUrl: logo_url,
            faviconUrl: favicon_url,
            themeColor: theme_color,
            primaryFont: primary_font,
            secondaryFont: secondary_font
        });

        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateBranding(req, res, next) {
    try {
        const { logo_url, favicon_url, theme_color, primary_font, secondary_font } = req.body;
        const result = await brandingService.updateBranding(req.params.id, req.user.school_id, {
            logoUrl: logo_url,
            faviconUrl: favicon_url,
            themeColor: theme_color,
            primaryFont: primary_font,
            secondaryFont: secondary_font
        });

        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteBranding(req, res, next) {
    try {
        const result = await brandingService.deleteBranding(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getBranding,
    getBrandingById,
    createBranding,
    updateBranding,
    deleteBranding
};