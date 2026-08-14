const express = require("express");
const roleController = require("../controllers/role.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), roleController.getRoles);
router.get("/:id", requirePermission("academics.manage"), roleController.getRoleById);
router.post("/", requirePermission("academics.manage"), roleController.createRole);
router.put("/:id", requirePermission("academics.manage"), roleController.updateRole);
router.delete("/:id", requirePermission("academics.manage"), roleController.deleteRole);

module.exports = router;
