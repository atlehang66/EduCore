const express = require("express");
const schoolController = require("../controllers/school.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), schoolController.getSchools);
router.get("/:id", requirePermission("academics.manage"), schoolController.getSchoolById);
router.post("/", requirePermission("academics.manage"), schoolController.createSchool);
router.put("/:id", requirePermission("academics.manage"), schoolController.updateSchool);
router.delete("/:id", requirePermission("academics.manage"), schoolController.deleteSchool);

module.exports = router;
