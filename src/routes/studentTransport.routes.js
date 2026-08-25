const express = require("express");
const studentTransportController = require("../controllers/studentTransport.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("finance.manage"), studentTransportController.getStudentTransports);
router.get("/:id", requirePermission("finance.manage"), studentTransportController.getStudentTransportById);
router.post("/", requirePermission("finance.manage"), studentTransportController.createStudentTransport);
router.put("/:id", requirePermission("finance.manage"), studentTransportController.updateStudentTransport);
router.delete("/:studentId/:transportId", requirePermission("finance.manage"), studentTransportController.deleteStudentTransport);

module.exports = router;
