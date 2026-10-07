const express = require("express");
const transportController = require("../controllers/transport.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("academics.manage"), transportController.getTransports);
router.get("/:id", requirePermission("academics.manage"), transportController.getTransportById);
router.post("/", requirePermission("academics.manage"), transportController.createTransport);
router.put("/:id", requirePermission("academics.manage"), transportController.updateTransport);
router.delete("/:id", requirePermission("academics.manage"), transportController.deleteTransport);

module.exports = router;
