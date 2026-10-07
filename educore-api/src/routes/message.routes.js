const express = require("express");
const messageController = require("../controllers/message.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("communications.manage"), messageController.getMessages);
router.get("/:id", requirePermission("communications.manage"), messageController.getMessageById);
router.post("/", requirePermission("communications.manage"), messageController.createMessage);
router.post("/:id/read", requirePermission("communications.manage"), messageController.markRead);
router.delete("/:id", requirePermission("communications.manage"), messageController.deleteMessage);

module.exports = router;