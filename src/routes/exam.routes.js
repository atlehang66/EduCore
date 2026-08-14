const express = require("express");
const examController = require("../controllers/exam.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), examController.getExams);
router.get("/:id", requirePermission("academics.manage"), examController.getExamById);
router.post("/", requirePermission("academics.manage"), examController.createExam);
router.put("/:id", requirePermission("academics.manage"), examController.updateExam);
router.delete("/:id", requirePermission("academics.manage"), examController.deleteExamById);

module.exports = router;
