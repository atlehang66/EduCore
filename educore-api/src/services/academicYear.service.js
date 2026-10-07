const academicYearRepository = require("../repositories/academicYear.repository");

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function isValidDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function hasValidDateRange(startDate, endDate) {
    return (
        isValidDate(startDate) &&
        isValidDate(endDate) &&
        new Date(startDate) < new Date(endDate)
    );
}

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
    if (!isPositiveInteger(academicYearId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

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

    if (!hasValidDateRange(startDate, endDate)) {
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
    if (!isPositiveInteger(academicYearId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

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

    if (!hasValidDateRange(startDate, endDate)) {
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
    if (!isPositiveInteger(academicYearId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

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