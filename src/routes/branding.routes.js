const express = require("express");
const brandingController = require("../controllers/branding.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), brandingController.getBranding);
router.get("/:id", requirePermission("academics.manage"), brandingController.getBrandingById);
router.post("/", requirePermission("academics.manage"), brandingController.createBranding);
router.put("/:id", requirePermission("academics.manage"), brandingController.updateBranding);
router.delete("/:id", requirePermission("academics.manage"), brandingController.deleteBranding);

module.exports = router;
