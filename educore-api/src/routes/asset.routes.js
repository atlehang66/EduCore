const express = require("express");
const assetController = require("../controllers/asset.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("finance.manage"), assetController.getAssets);
router.get("/:id", requirePermission("finance.manage"), assetController.getAssetById);
router.post("/", requirePermission("finance.manage"), assetController.createAsset);
router.put("/:id", requirePermission("finance.manage"), assetController.updateAsset);
router.delete("/:id", requirePermission("finance.manage"), assetController.deleteAsset);

module.exports = router;