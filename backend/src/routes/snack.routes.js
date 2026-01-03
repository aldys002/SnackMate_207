const express = require("express");
const router = express.Router();
const apiKeyMiddleware = require("../middleware/apikey.middleware");
const snackController = require("../controllers/snack.controller");

// GET all snacks
router.get("/", apiKeyMiddleware, snackController.getAllSnacks);

// GET snack by ID
router.get("/:id", apiKeyMiddleware, snackController.getSnackById);

// ADD snack
router.post("/", apiKeyMiddleware, snackController.addSnack);

// UPDATE snack
router.put("/:id", apiKeyMiddleware, snackController.updateSnack);

// DELETE snack
router.delete("/:id", apiKeyMiddleware, snackController.deleteSnack);

module.exports = router;
