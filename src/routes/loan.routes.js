const express = require("express");
const loanController = require("../controllers/loan.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("library.manage"), loanController.getLoans);
router.get("/:id", requirePermission("library.manage"), loanController.getLoanById);
router.post("/", requirePermission("library.manage"), loanController.createLoan);
router.put("/:id", requirePermission("library.manage"), loanController.updateLoan);
router.delete("/:id", requirePermission("library.manage"), loanController.deleteLoan);

module.exports = router;