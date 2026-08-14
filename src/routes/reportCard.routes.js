const express = require("express");
const reportCardController = require("../controllers/reportCard.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), reportCardController.getReportCards);
router.get("/:id", requirePermission("academics.manage"), reportCardController.getReportCardById);
router.post("/", requirePermission("academics.manage"), reportCardController.createReportCard);
router.put("/:id", requirePermission("academics.manage"), reportCardController.updateReportCard);
router.delete("/:id", requirePermission("academics.manage"), reportCardController.deleteReportCardById);

module.exports = router;
