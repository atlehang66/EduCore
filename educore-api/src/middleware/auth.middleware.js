const { verifyToken } = require("../utils/jwt");
const authRepository = require("../repositories/auth.repository");

async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        const user = await authRepository.findUserById(
            decoded.sub,
            decoded.school_id
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account not found"
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: "User account is inactive"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
}

module.exports = {
    authenticate
};