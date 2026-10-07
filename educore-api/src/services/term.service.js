const termRepository = require("../repositories/term.repository");
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

async function academicYearExists(academicYearId, schoolId) {
    if (!isPositiveInteger(academicYearId)) {
        return false;
    }

    const academicYear = await academicYearRepository.findAcademicYearById(
        academicYearId,
        schoolId
    );

    return Boolean(academicYear);
}

async function getAllTerms(academicYearId, schoolId) {
    if (!(await academicYearExists(academicYearId, schoolId))) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

    const terms = await termRepository.findAllTerms(
        academicYearId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            terms
        }
    };
}
async function getTermById(termId, academicYearId, schoolId) {
    if (
        !(await academicYearExists(academicYearId, schoolId)) ||
        !isPositiveInteger(termId)
    ) {
        return {
            success: false,
            statusCode: 404,
            message: "Term not found"
        };
    }

    const term = await termRepository.findTermById(
        termId,
        academicYearId
    );

    if (!term) {
        return {
            success: false,
            statusCode: 404,
            message: "Term not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            term
        }
    };
}
async function createTerm({
    academicYearId,
    schoolId,
    name,
    startDate,
    endDate,
    termOrder
}) {
    if (!(await academicYearExists(academicYearId, schoolId))) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

    if (!name || !startDate || !endDate || !isPositiveInteger(termOrder)) {
        return {
            success: false,
            statusCode: 400,
            message: "name, start_date, end_date and term_order are required"
        };
    }

    if (!hasValidDateRange(startDate, endDate)) {
        return {
            success: false,
            statusCode: 400,
            message: "start_date must be before end_date"
        };
    }

    const termId = await termRepository.createTerm({
        academicYearId,
        name,
        startDate,
        endDate,
        termOrder
    });

    const term = await termRepository.findTermById(
        termId,
        academicYearId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            term
        }
    };
}
async function updateTerm(
    termId,
    academicYearId,
    schoolId,
    {
        name,
        startDate,
        endDate,
        termOrder
    }
) {
    if (!(await academicYearExists(academicYearId, schoolId))) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

    if (!isPositiveInteger(termId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Term not found"
        };
    }

    const existingTerm =
        await termRepository.findTermById(
            termId,
            academicYearId
        );

    if (!existingTerm) {
        return {
            success: false,
            statusCode: 404,
            message: "Term not found"
        };
    }

    if (!name || !startDate || !endDate || !isPositiveInteger(termOrder)) {
        return {
            success: false,
            statusCode: 400,
            message: "name, start_date, end_date and term_order are required"
        };
    }

    if (!hasValidDateRange(startDate, endDate)) {
        return {
            success: false,
            statusCode: 400,
            message: "start_date must be before end_date"
        };
    }

    await termRepository.updateTerm(
        termId,
        academicYearId,
        {
            name,
            startDate,
            endDate,
            termOrder
        }
    );

    const term =
        await termRepository.findTermById(
            termId,
            academicYearId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            term
        }
    };
}
async function deleteTermById(termId, academicYearId, schoolId) {
    if (
        !(await academicYearExists(academicYearId, schoolId)) ||
        !isPositiveInteger(termId)
    ) {
        return {
            success: false,
            statusCode: 404,
            message: "Term not found"
        };
    }

    const existingTerm =
        await termRepository.findTermById(
            termId,
            academicYearId
        );

    if (!existingTerm) {
        return {
            success: false,
            statusCode: 404,
            message: "Term not found"
        };
    }

    await termRepository.deleteTerm(
        termId,
        academicYearId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Term deleted successfully"
    };
}
module.exports = {
    getAllTerms,
    getTermById,
    createTerm,
    updateTerm,
    deleteTermById
};