const express = require("express");
const apiKeyController = require("../controllers/apiKey.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), apiKeyController.getApiKeys);
router.get("/:id", requirePermission("academics.manage"), apiKeyController.getApiKeyById);
router.post("/", requirePermission("academics.manage"), apiKeyController.createApiKey);
router.put("/:id", requirePermission("academics.manage"), apiKeyController.updateApiKey);
router.delete("/:id", requirePermission("academics.manage"), apiKeyController.deleteApiKey);

module.exports = router;