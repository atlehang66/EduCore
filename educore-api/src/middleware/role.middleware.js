const authRepository = require("../repositories/auth.repository");

function requirePermission(permissionCode) {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const permissions = await authRepository.findUserPermissions(
                req.user.user_id
            );

            const hasPermission = permissions.some(
                permission => permission.code === permissionCode
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to perform this action",
                    required_permission: permissionCode
                });
            }

            next();

        } catch (error) {
            console.error("Authorization error:", error);

            return res.status(500).json({
                success: false,
                message: "Authorization check failed"
            });
        }
    };
}

module.exports = {
    requirePermission
};
