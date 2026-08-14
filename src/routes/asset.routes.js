const express = require("express");
const assetController = require("../controllers/asset.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("operations.manage"), assetController.getAssets);
router.get("/:id", requirePermission("operations.manage"), assetController.getAssetById);
router.post("/", requirePermission("operations.manage"), assetController.createAsset);
router.put("/:id", requirePermission("operations.manage"), assetController.updateAsset);
router.delete("/:id", requirePermission("operations.manage"), assetController.deleteAsset);

module.exports = router;