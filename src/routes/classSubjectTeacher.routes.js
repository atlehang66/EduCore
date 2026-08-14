const express = require("express");
const cstController = require("../controllers/classSubjectTeacher.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

// Nested routes to manage class -> subject -> teacher assignments
router.get(
    "/classes/:classId/subjects/:subjectId/teachers",
    requirePermission("academics.manage"),
    cstController.getTeachers
);

router.post(
    "/classes/:classId/subjects/:subjectId/teachers",
    requirePermission("academics.manage"),
    cstController.createAssignment
);

router.put(
    "/classes/:classId/subjects/:subjectId/teachers/:teacherId",
    requirePermission("academics.manage"),
    cstController.updateAssignment
);

router.delete(
    "/classes/:classId/subjects/:subjectId/teachers/:teacherId",
    requirePermission("academics.manage"),
    cstController.deleteAssignment
);

module.exports = router;
