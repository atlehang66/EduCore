const express = require("express");
const transportController = require("../controllers/transport.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("transport.manage"), transportController.getTransports);
router.get("/:id", requirePermission("transport.manage"), transportController.getTransportById);
router.post("/", requirePermission("transport.manage"), transportController.createTransport);
router.put("/:id", requirePermission("transport.manage"), transportController.updateTransport);
router.delete("/:id", requirePermission("transport.manage"), transportController.deleteTransport);

module.exports = router;
