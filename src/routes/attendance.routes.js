const express = require("express");

const attendanceController =
    require("../controllers/attendance.controller");

const {
    authenticate
} = require("../middleware/auth.middleware");

const {
    requirePermission
} = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    attendanceController.getAttendance
);

router.get(
    "/:id",
    requirePermission("academics.manage"),
    attendanceController.getAttendanceById
);

router.post(
    "/",
    requirePermission("academics.manage"),
    attendanceController.createAttendance
);

router.put(
    "/:id",
    requirePermission("academics.manage"),
    attendanceController.updateAttendance
);

router.delete(
    "/:id",
    requirePermission("academics.manage"),
    attendanceController.deleteAttendanceById
);

module.exports = router;