const academicYearRepository = require("../repositories/academicYear.repository");

async function getAllAcademicYears(schoolId) {
    const academicYears =
        await academicYearRepository.findAllAcademicYears(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            academicYears
        }
    };
}
async function getAcademicYearById(academicYearId, schoolId) {
    const academicYear =
        await academicYearRepository.findAcademicYearById(
            academicYearId,
            schoolId
        );

    if (!academicYear) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            academicYear
        }
    };
}
async function createAcademicYear({
    schoolId,
    name,
    startDate,
    endDate,
    isCurrent
}) {
    if (!name || !startDate || !endDate) {
        return {
            success: false,
            statusCode: 400,
            message: "name, start_date and end_date are required"
        };
    }

    if (new Date(startDate) >= new Date(endDate)) {
        return {
            success: false,
            statusCode: 400,
            message: "start_date must be before end_date"
        };
    }

    const academicYearId =
        await academicYearRepository.createAcademicYear({
            schoolId,
            name,
            startDate,
            endDate,
            isCurrent
        });

    const academicYear =
        await academicYearRepository.findAcademicYearById(
            academicYearId,
            schoolId
        );

    return {
        success: true,
        statusCode: 201,
        data: {
            academicYear
        }
    };
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
    const existingAcademicYear =
        await academicYearRepository.findAcademicYearById(
            academicYearId,
            schoolId
        );

    if (!existingAcademicYear) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

    if (!name || !startDate || !endDate) {
        return {
            success: false,
            statusCode: 400,
            message: "name, start_date and end_date are required"
        };
    }

    if (new Date(startDate) >= new Date(endDate)) {
        return {
            success: false,
            statusCode: 400,
            message: "start_date must be before end_date"
        };
    }

    await academicYearRepository.updateAcademicYear(
        academicYearId,
        schoolId,
        {
            name,
            startDate,
            endDate,
            isCurrent
        }
    );

    const academicYear =
        await academicYearRepository.findAcademicYearById(
            academicYearId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            academicYear
        }
    };
}
async function deleteAcademicYearById(academicYearId, schoolId) {
    const existingAcademicYear =
        await academicYearRepository.findAcademicYearById(
            academicYearId,
            schoolId
        );

    if (!existingAcademicYear) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

    try {
        await academicYearRepository.deleteAcademicYear(
            academicYearId,
            schoolId
        );
    } catch (error) {
        if (error.statusCode === 409) {
            return {
                success: false,
                statusCode: 409,
                message: error.message
            };
        }

        throw error;
    }

    return {
        success: true,
        statusCode: 200,
        message: "Academic year deleted successfully"
    };
}
module.exports = {
    getAllAcademicYears,
    getAcademicYearById,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYearById
};