const express = require("express");

const classController = require("../controllers/class.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    classController.getClasses
);
router.get(
    "/:id",
    requirePermission("academics.manage"),
    classController.getClassById
);
router.post(
    "/",
    requirePermission("academics.manage"),
    classController.createClass
);
router.put(
    "/:id",
    requirePermission("academics.manage"),
    classController.updateClass
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    classController.deleteClassById
);
module.exports = router;