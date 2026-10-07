const express = require("express");
const marksController = require("../controllers/marks.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), marksController.getMarks);
router.get("/:id", requirePermission("academics.manage"), marksController.getMarkById);
router.post("/", requirePermission("academics.manage"), marksController.createMark);
router.put("/:id", requirePermission("academics.manage"), marksController.updateMark);
router.delete("/:id", requirePermission("academics.manage"), marksController.deleteMarkById);

module.exports = router;
