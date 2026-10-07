const express = require("express");
const paymentController = require("../controllers/payment.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("finance.manage"), paymentController.getPayments);
router.get("/:id", requirePermission("finance.manage"), paymentController.getPaymentById);
router.post("/", requirePermission("finance.manage"), paymentController.createPayment);
router.put("/:id", requirePermission("finance.manage"), paymentController.updatePayment);
router.delete("/:id", requirePermission("finance.manage"), paymentController.deletePayment);

module.exports = router;