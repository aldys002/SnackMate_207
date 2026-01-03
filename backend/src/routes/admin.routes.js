const express = require("express");
const router = express.Router();
const snackController = require("../controllers/snack.controller");
const adminController = require("../controllers/admin.controller"); // ✅ harus ada
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// Semua route admin harus login + role admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Users & API Keys
router.get("/users", adminController.getUsers);
router.get("/apikeys", adminController.getApiKeys);

// CRUD snack
router.get("/snacks", snackController.getAllSnacks);
router.get("/snacks/:id", snackController.getSnackById);
router.post("/snacks", snackController.addSnack);
router.put("/snacks/:id", snackController.updateSnack);
router.delete("/snacks/:id", snackController.deleteSnack);

module.exports = router;
