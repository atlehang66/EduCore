const express = require("express");

const notificationController = require("../controllers/notification.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("communications.manage"),
    notificationController.getNotifications
);

router.get(
    "/:id",
    requirePermission("communications.manage"),
    notificationController.getNotificationById
);

router.post(
    "/",
    requirePermission("communications.manage"),
    notificationController.createNotification
);

router.put(
    "/:id/read",
    requirePermission("communications.manage"),
    notificationController.markNotificationRead
);

router.put(
    "/read-all",
    requirePermission("communications.manage"),
    notificationController.markAllNotificationsRead
);

router.delete(
    "/:id",
    requirePermission("communications.manage"),
    notificationController.deleteNotification
);

module.exports = router;