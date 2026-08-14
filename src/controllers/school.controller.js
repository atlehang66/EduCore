const schoolService = require("../services/school.service");

async function getSchools(req, res, next) {
    try {
        const result = await schoolService.getAllSchools();
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getSchoolById(req, res, next) {
    try {
        const result = await schoolService.getSchoolById(req.params.id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createSchool(req, res, next) {
    try {
        const { name, code, address, phone, email, website, timezone } = req.body;
        const result = await schoolService.createSchool({ name, code, address, phone, email, website, timezone });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateSchool(req, res, next) {
    try {
        const { name, code, address, phone, email, website, timezone } = req.body;
        const result = await schoolService.updateSchool(req.params.id, { name, code, address, phone, email, website, timezone });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteSchool(req, res, next) {
    try {
        const result = await schoolService.deleteSchool(req.params.id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        // If MySQL complains about foreign-key restrictions, translate to 409
        if (error && error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({ success: false, message: "Cannot delete school: dependent records exist" });
        }
        next(error);
    }
}

module.exports = {
    getSchools,
    getSchoolById,
    createSchool,
    updateSchool,
    deleteSchool
};