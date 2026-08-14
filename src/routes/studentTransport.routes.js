const express = require("express");
const studentTransportController = require("../controllers/studentTransport.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("transport.manage"), studentTransportController.getStudentTransports);
router.get("/:id", requirePermission("transport.manage"), studentTransportController.getStudentTransportById);
router.post("/", requirePermission("transport.manage"), studentTransportController.createStudentTransport);
router.put("/:id", requirePermission("transport.manage"), studentTransportController.updateStudentTransport);
router.delete("/:id", requirePermission("transport.manage"), studentTransportController.deleteStudentTransport);

module.exports = router;
