const express = require("express");
const discountController = require("../controllers/discount.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("finance.manage"), discountController.getDiscounts);
router.get("/:id", requirePermission("finance.manage"), discountController.getDiscountById);
router.post("/", requirePermission("finance.manage"), discountController.createDiscount);
router.put("/:id", requirePermission("finance.manage"), discountController.updateDiscount);
router.delete("/:id", requirePermission("finance.manage"), discountController.deleteDiscount);

module.exports = router;