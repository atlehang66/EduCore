const express = require("express");

const academicYearController = require("../controllers/academicYear.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    academicYearController.getAcademicYears
);
router.get(
    "/:id",
    requirePermission("academics.manage"),
    academicYearController.getAcademicYearById
);
router.post(
    "/",
    requirePermission("academics.manage"),
    academicYearController.createAcademicYear
);
router.put(
    "/:id",
    requirePermission("academics.manage"),
    academicYearController.updateAcademicYear
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    academicYearController.deleteAcademicYearById
);
module.exports = router;