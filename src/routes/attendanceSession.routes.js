const express = require("express");

const attendanceSessionController = require("../controllers/attendanceSession.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    attendanceSessionController.getAttendanceSessions
);

router.get(
    "/:id",
    requirePermission("academics.manage"),
    attendanceSessionController.getAttendanceSessionById
);

router.post(
    "/",
    requirePermission("academics.manage"),
    attendanceSessionController.createAttendanceSession
);

router.put(
    "/:id",
    requirePermission("academics.manage"),
    attendanceSessionController.updateAttendanceSession
);

router.delete(
    "/:id",
    requirePermission("academics.manage"),
    attendanceSessionController.deleteAttendanceSessionById
);

module.exports = router;
