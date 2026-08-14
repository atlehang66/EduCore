const express = require("express");
const urController = require("../controllers/userRole.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get(
    "/users/:userId/roles",
    requirePermission("academics.manage"),
    urController.getUserRoles
);

router.post(
    "/users/:userId/roles",
    requirePermission("academics.manage"),
    urController.addRole
);

router.delete(
    "/users/:userId/roles/:roleId",
    requirePermission("academics.manage"),
    urController.removeRole
);

module.exports = router;
