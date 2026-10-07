const paymentMethodRepository = require("../repositories/paymentMethod.repository");

function isPositiveInteger(value) {
    return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isValidBoolean(value) {
    return typeof value === "boolean";
}

async function getAllPaymentMethods(schoolId) {
    const rows = await paymentMethodRepository.findAllPaymentMethods(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            payment_methods: rows
        }
    };
}

async function getPaymentMethodById(id, schoolId) {
    if (!isPositiveInteger(id)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid payment method ID"
        };
    }

    const paymentMethod =
        await paymentMethodRepository.findPaymentMethodById(
            Number(id),
            schoolId
        );

    if (!paymentMethod) {
        return {
            success: false,
            statusCode: 404,
            message: "Payment method not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            payment_method: paymentMethod
        }
    };
}

async function createPaymentMethod(schoolId, { name, is_active }) {
    if (typeof name !== "string" || !name.trim()) {
        return {
            success: false,
            statusCode: 400,
            message: "name is required"
        };
    }

    const trimmedName = name.trim();

    if (trimmedName.length > 50) {
        return {
            success: false,
            statusCode: 400,
            message: "name must not exceed 50 characters"
        };
    }

    if (
        is_active !== undefined &&
        !isValidBoolean(is_active)
    ) {
        return {
            success: false,
            statusCode: 400,
            message: "is_active must be a boolean"
        };
    }

    const existing =
        await paymentMethodRepository.findPaymentMethodByName(
            trimmedName,
            schoolId
        );

    if (existing) {
        return {
            success: false,
            statusCode: 409,
            message: "Payment method with this name already exists"
        };
    }

    const id = await paymentMethodRepository.createPaymentMethod({
        schoolId,
        name: trimmedName,
        isActive: is_active === undefined ? true : is_active
    });

    const created =
        await paymentMethodRepository.findPaymentMethodById(
            id,
            schoolId
        );

    return {
        success: true,
        statusCode: 201,
        data: {
            payment_method: created
        }
    };
}

async function updatePaymentMethod(id, schoolId, { name, is_active }) {
    if (!isPositiveInteger(id)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid payment method ID"
        };
    }

    const paymentMethodId = Number(id);

    const existing =
        await paymentMethodRepository.findPaymentMethodById(
            paymentMethodId,
            schoolId
        );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Payment method not found"
        };
    }

    if (typeof name !== "string" || !name.trim()) {
        return {
            success: false,
            statusCode: 400,
            message: "name is required"
        };
    }

    const trimmedName = name.trim();

    if (trimmedName.length > 50) {
        return {
            success: false,
            statusCode: 400,
            message: "name must not exceed 50 characters"
        };
    }

    if (
        is_active !== undefined &&
        !isValidBoolean(is_active)
    ) {
        return {
            success: false,
            statusCode: 400,
            message: "is_active must be a boolean"
        };
    }

    if (trimmedName !== existing.name) {
        const other =
            await paymentMethodRepository.findPaymentMethodByName(
                trimmedName,
                schoolId
            );

        if (other) {
            return {
                success: false,
                statusCode: 409,
                message: "Another payment method with this name exists"
            };
        }
    }

    await paymentMethodRepository.updatePaymentMethod(
        paymentMethodId,
        schoolId,
        {
            name: trimmedName,
            isActive:
                is_active === undefined
                    ? Boolean(existing.is_active)
                    : is_active
        }
    );

    const updated =
        await paymentMethodRepository.findPaymentMethodById(
            paymentMethodId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            payment_method: updated
        }
    };
}

async function deletePaymentMethod(id, schoolId) {
    if (!isPositiveInteger(id)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid payment method ID"
        };
    }

    const paymentMethodId = Number(id);

    const existing =
        await paymentMethodRepository.findPaymentMethodById(
            paymentMethodId,
            schoolId
        );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Payment method not found"
        };
    }

    const pool = require("../config/database");

    const [dependencies] = await pool.query(
        `
        SELECT 1
        FROM payments
        WHERE payment_method_id = ?
        LIMIT 1
        `,
        [paymentMethodId]
    );

    if (dependencies.length > 0) {
        return {
            success: false,
            statusCode: 409,
            message: "Cannot delete payment method with existing payments"
        };
    }

    await paymentMethodRepository.deletePaymentMethod(
        paymentMethodId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Payment method deleted successfully"
    };
}

module.exports = {
    getAllPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
};