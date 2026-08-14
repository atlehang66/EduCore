const express = require("express");
const fileController = require("../controllers/file.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("documents.manage"), fileController.getFiles);
router.get("/:id", requirePermission("documents.manage"), fileController.getFileById);
router.post("/", requirePermission("documents.manage"), fileController.createFile);
router.delete("/:id", requirePermission("documents.manage"), fileController.deleteFile);

module.exports = router;