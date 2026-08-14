const express = require("express");
const invoiceController = require("../controllers/invoice.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("finance.manage"), invoiceController.getInvoices);
router.get("/:id", requirePermission("finance.manage"), invoiceController.getInvoiceById);
router.post("/", requirePermission("finance.manage"), invoiceController.createInvoice);
router.put("/:id", requirePermission("finance.manage"), invoiceController.updateInvoice);
router.delete("/:id", requirePermission("finance.manage"), invoiceController.deleteInvoice);

module.exports = router;