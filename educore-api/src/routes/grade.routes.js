const express = require("express");

const gradeController = require("../controllers/grade.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    gradeController.getGrades
);

router.get(
    "/:id",
    requirePermission("academics.manage"),
    gradeController.getGradeById
);

router.post(
    "/",
    requirePermission("academics.manage"),
    gradeController.createGrade
);

router.put(
    "/:id",
    requirePermission("academics.manage"),
    gradeController.updateGrade
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    gradeController.deleteGradeById
);
module.exports = router;