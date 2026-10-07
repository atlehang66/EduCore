const express = require("express");

const studentController = require("../controllers/student.controller");
const { authenticate } = require("../middleware/auth.middleware");

const { requirePermission } = require("../middleware/role.middleware");
const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    requirePermission("students.manage"),
    studentController.createStudent
);
    
router.get(
    "/",
    requirePermission("students.manage"),
    studentController.getStudents
);

router.get(
    "/:id",
    requirePermission("students.manage"),
    studentController.getStudent
);

router.put(
    "/:id",
    requirePermission("students.manage"),
    studentController.updateStudent
);

router.delete(
    "/:id",
    requirePermission("students.manage"),
    studentController.deleteStudent
);

module.exports = router;