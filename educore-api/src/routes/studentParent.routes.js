const express = require("express");

const studentParentController = require("../controllers/studentParent.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/students/:studentId/parents",
    requirePermission("academics.manage"),
    studentParentController.getStudentParents
);
router.post(
    "/students/:studentId/parents",
    requirePermission("academics.manage"),
    studentParentController.createStudentParent
);
router.put(
    "/students/:studentId/parents/:parentId",
    requirePermission("academics.manage"),
    studentParentController.updateStudentParent
);
router.delete(
    "/students/:studentId/parents/:parentId",
    requirePermission("academics.manage"),
    studentParentController.deleteStudentParent
);
module.exports = router;