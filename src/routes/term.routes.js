const express = require("express");

const termController = require("../controllers/term.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/:academicYearId/terms",
    requirePermission("academics.manage"),
    termController.getTerms
);
router.get(
    "/:academicYearId/terms/:id",
    requirePermission("academics.manage"),
    termController.getTermById
);
router.post(
    "/:academicYearId/terms",
    requirePermission("academics.manage"),
    termController.createTerm
);
router.put(
    "/:academicYearId/terms/:id",
    requirePermission("academics.manage"),
    termController.updateTerm
);
router.delete(
    "/:academicYearId/terms/:id",
    requirePermission("academics.manage"),
    termController.deleteTermById
);
module.exports = router;