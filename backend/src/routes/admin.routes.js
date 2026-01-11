const express = require("express");
const router = express.Router();
const snackController = require("../controllers/snack.controller");
const adminController = require("../controllers/admin.controller"); 
const { verifyToken } = require("../middleware/auth.middleware"); // ✅ Ubah bagian ini
const adminMiddleware = require("../middleware/admin.middleware");

// Gunakan verifyToken, bukan authMiddleware yang undefined
router.use(verifyToken); 
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