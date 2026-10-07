const express = require("express");
const inventoryController = require("../controllers/inventory.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("operations.manage"), inventoryController.getInventory);
router.get("/:id", requirePermission("operations.manage"), inventoryController.getInventoryById);
router.post("/", requirePermission("operations.manage"), inventoryController.createInventory);
router.put("/:id", requirePermission("operations.manage"), inventoryController.updateInventory);
router.delete("/:id", requirePermission("operations.manage"), inventoryController.deleteInventory);

module.exports = router;