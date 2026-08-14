const express = require("express");
const loginHistoryController = require("../controllers/loginHistory.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("audit.view"), loginHistoryController.getLoginHistory);
router.get("/:id", requirePermission("audit.view"), loginHistoryController.getLoginById);
router.post("/", loginHistoryController.createLogin);

module.exports = router;