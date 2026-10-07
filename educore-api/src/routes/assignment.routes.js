const express = require("express");

const assignmentController =
    require("../controllers/assignment.controller");

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
    assignmentController.getAssignments
);
router.get(
    "/:id",
    requirePermission("academics.manage"),
    assignmentController.getAssignmentById
);
router.post(
    "/",
    requirePermission("academics.manage"),
    assignmentController.createAssignment
);
router.put(
    "/:id",
    requirePermission("academics.manage"),
    assignmentController.updateAssignment
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    assignmentController.deleteAssignmentById
);
module.exports = router;