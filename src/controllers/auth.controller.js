const authService = require("../services/auth.service");
const authRepository = require("../repositories/auth.repository");

async function login(req, res, next) {
    try {
        const {
            school_id,
            email,
            password
        } = req.body;

        if (!school_id || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "school_id, email and password are required"
            });
        }

        const result = await authService.login({
            schoolId: school_id,
            email,
            password,
            ipAddress: req.ip,
            userAgent: req.get("user-agent")
        });

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });

    } catch (error) {
        next(error);
    }
}
async function me(req, res, next) {
    try {
        const roles = await authRepository.findUserRoles(
            req.user.user_id
        );

        const permissions = await authRepository.findUserPermissions(
            req.user.user_id
        );

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user.user_id,
                    school_id: req.user.school_id,
                    email: req.user.email,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    phone: req.user.phone,
                    roles,
                    permissions
                }
            }
        });

    } catch (error) {
        next(error);
    }
}
module.exports = {
    login,
    me
};