const express = require("express");

const subjectController = require("../controllers/subject.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    subjectController.getSubjects
);
router.get(
    "/:id",
    requirePermission("academics.manage"),
    subjectController.getSubjectById
);
router.post(
    "/",
    requirePermission("academics.manage"),
    subjectController.createSubject
);
router.put(
    "/:id",
    requirePermission("academics.manage"),
    subjectController.updateSubject
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    subjectController.deleteSubjectById
);

module.exports = router;