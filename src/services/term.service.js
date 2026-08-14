const termRepository = require("../repositories/term.repository");

async function getAllTerms(academicYearId) {
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
async function getTermById(termId, academicYearId) {
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
    name,
    startDate,
    endDate,
    termOrder
}) {
    if (!name || !startDate || !endDate || !termOrder) {
        return {
            success: false,
            statusCode: 400,
            message: "name, start_date, end_date and term_order are required"
        };
    }

    if (new Date(startDate) >= new Date(endDate)) {
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
    {
        name,
        startDate,
        endDate,
        termOrder
    }
) {
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

    if (!name || !startDate || !endDate || !termOrder) {
        return {
            success: false,
            statusCode: 400,
            message: "name, start_date, end_date and term_order are required"
        };
    }

    if (new Date(startDate) >= new Date(endDate)) {
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
async function deleteTermById(termId, academicYearId) {
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