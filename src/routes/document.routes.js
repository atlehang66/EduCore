const express = require("express");
const documentController = require("../controllers/document.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("documents.manage"), documentController.getDocuments);
router.get("/:id", requirePermission("documents.manage"), documentController.getDocumentById);
router.post("/", requirePermission("documents.manage"), documentController.createDocument);
router.put("/:id", requirePermission("documents.manage"), documentController.updateDocument);
router.delete("/:id", requirePermission("documents.manage"), documentController.deleteDocument);

module.exports = router;