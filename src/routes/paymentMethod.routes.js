const express = require("express");
const paymentMethodController = require("../controllers/paymentMethod.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("finance.manage"), paymentMethodController.getPaymentMethods);
router.get("/:id", requirePermission("finance.manage"), paymentMethodController.getPaymentMethodById);
router.post("/", requirePermission("finance.manage"), paymentMethodController.createPaymentMethod);
router.put("/:id", requirePermission("finance.manage"), paymentMethodController.updatePaymentMethod);
router.delete("/:id", requirePermission("finance.manage"), paymentMethodController.deletePaymentMethod);

module.exports = router;