const express = require("express");
const permissionController = require("../controllers/permission.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), permissionController.getPermissions);
router.get("/:id", requirePermission("academics.manage"), permissionController.getPermissionById);
router.post("/", requirePermission("academics.manage"), permissionController.createPermission);
router.put("/:id", requirePermission("academics.manage"), permissionController.updatePermission);
router.delete("/:id", requirePermission("academics.manage"), permissionController.deletePermission);

module.exports = router;
