const schoolRepository = require("../repositories/school.repository");

async function getAllSchools() {
    const schools = await schoolRepository.findAllSchools();
    return { success: true, statusCode: 200, data: { schools } };
}

async function getSchoolById(schoolId) {
    const school = await schoolRepository.findSchoolById(schoolId);
    if (!school) return { success: false, statusCode: 404, message: "School not found" };
    return { success: true, statusCode: 200, data: { school } };
}

async function createSchool({ name, code, address, phone, email, website, timezone }) {
    if (!name) return { success: false, statusCode: 400, message: "name is required" };

    // prevent duplicate by name
    const existing = await schoolRepository.findSchoolByName(name);
    if (existing) return { success: false, statusCode: 409, message: "A school with that name already exists" };

    const schoolId = await schoolRepository.createSchool({ name, code, address, phone, email, website, timezone });
    const school = await schoolRepository.findSchoolById(schoolId);
    return { success: true, statusCode: 201, data: { school } };
}

async function updateSchool(schoolId, { name, code, address, phone, email, website, timezone }) {
    const existing = await schoolRepository.findSchoolById(schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "School not found" };

    if (!name) return { success: false, statusCode: 400, message: "name is required" };

    const duplicate = await schoolRepository.findSchoolByName(name);
    if (duplicate && duplicate.school_id !== Number(schoolId)) {
        return { success: false, statusCode: 409, message: "Another school with that name already exists" };
    }

    await schoolRepository.updateSchool(schoolId, { name, code, address, phone, email, website, timezone });
    const school = await schoolRepository.findSchoolById(schoolId);
    return { success: true, statusCode: 200, data: { school } };
}

async function deleteSchool(schoolId) {
    const existing = await schoolRepository.findSchoolById(schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "School not found" };

    // Note: do not cascade delete related records. If DB restricts delete, it will error — let service bubble up as 409 where appropriate.
    await schoolRepository.deleteSchool(schoolId);
    return { success: true, statusCode: 200, message: "School deleted successfully" };
}

module.exports = {
    getAllSchools,
    getSchoolById,
    createSchool,
    updateSchool,
    deleteSchool
};