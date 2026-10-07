const express = require("express");
const libraryBookController = require("../controllers/libraryBook.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requirePermission } = require("../middleware/role.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", requirePermission("library.manage"), libraryBookController.getBooks);
router.get("/:id", requirePermission("library.manage"), libraryBookController.getBookById);
router.post("/", requirePermission("library.manage"), libraryBookController.createBook);
router.put("/:id", requirePermission("library.manage"), libraryBookController.updateBook);
router.delete("/:id", requirePermission("library.manage"), libraryBookController.deleteBook);

module.exports = router;