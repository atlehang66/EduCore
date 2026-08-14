const express = require("express");

const parentController = require("../controllers/parent.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("academics.manage"),
    parentController.getParents
);
router.get(
    "/:id",
    requirePermission("academics.manage"),
    parentController.getParentById
);
router.post(
    "/",
    requirePermission("academics.manage"),
    parentController.createParent
);
router.put(
    "/:id",
    requirePermission("academics.manage"),
    parentController.updateParent
);
router.delete(
    "/:id",
    requirePermission("academics.manage"),
    parentController.deleteParentById
);
module.exports = router;