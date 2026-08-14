const express = require("express");
const settingController = require("../controllers/setting.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), settingController.getSettings);
router.get("/:id", requirePermission("academics.manage"), settingController.getSettingById);
router.post("/", requirePermission("academics.manage"), settingController.createSetting);
router.put("/:id", requirePermission("academics.manage"), settingController.updateSetting);
router.delete("/:id", requirePermission("academics.manage"), settingController.deleteSetting);

module.exports = router;
