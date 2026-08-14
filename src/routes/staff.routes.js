const express = require("express");

const staffController = require("../controllers/staff.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    staffController.getStaff
);
router.get(
    "/:id",
    requirePermission("academics.manage"),
    staffController.getStaffById
);
router.post(
    "/",
    requirePermission("academics.manage"),
    staffController.createStaff
);
router.put(
    "/:id",
    requirePermission("academics.manage"),
    staffController.updateStaff
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    staffController.deleteStaffById
);
module.exports = router;