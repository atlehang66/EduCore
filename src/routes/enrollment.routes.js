const express = require("express");

const enrollmentController =
    require("../controllers/enrollment.controller");

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
    enrollmentController.getEnrollments
);
router.get(
    "/:id",
    requirePermission("academics.manage"),
    enrollmentController.getEnrollmentById
);
router.post(
    "/",
    requirePermission("academics.manage"),
    enrollmentController.createEnrollment
);
router.put(
    "/:id",
    requirePermission("academics.manage"),
    enrollmentController.updateEnrollment
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    enrollmentController.deleteEnrollmentById
);
module.exports = router;