const express = require("express");

const teacherController = require("../controllers/teacher.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    teacherController.getTeachers
);
router.get(
    "/:id",
    requirePermission("academics.manage"),
    teacherController.getTeacherById
);
router.post(
    "/",
    requirePermission("academics.manage"),
    teacherController.createTeacher
);
router.put(
    "/:id",
    requirePermission("academics.manage"),
    teacherController.updateTeacher
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    teacherController.deleteTeacherById
);
module.exports = router;