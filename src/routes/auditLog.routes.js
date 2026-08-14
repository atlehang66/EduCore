const express = require("express");
const auditLogController = require("../controllers/auditLog.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("audit.view"), auditLogController.getAuditLogs);
router.get("/:id", requirePermission("audit.view"), auditLogController.getAuditLogById);
router.post("/", requirePermission("audit.view"), auditLogController.createAuditLog);

module.exports = router;