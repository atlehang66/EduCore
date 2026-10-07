const express = require("express");
const eventController = require("../controllers/event.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("events.manage"), eventController.getEvents);
router.get("/:id", requirePermission("events.manage"), eventController.getEventById);
router.post("/", requirePermission("events.manage"), eventController.createEvent);
router.put("/:id", requirePermission("events.manage"), eventController.updateEvent);
router.delete("/:id", requirePermission("events.manage"), eventController.deleteEvent);

module.exports = router;