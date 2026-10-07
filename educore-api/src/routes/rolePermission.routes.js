const express = require("express");
const rpController = require("../controllers/rolePermission.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get(
    "/roles/:roleId/permissions",
    requirePermission("academics.manage"),
    rpController.getPermissions
);

router.post(
    "/roles/:roleId/permissions",
    requirePermission("academics.manage"),
    rpController.addPermission
);

router.delete(
    "/roles/:roleId/permissions/:permissionId",
    requirePermission("academics.manage"),
    rpController.removePermission
);

module.exports = router;
