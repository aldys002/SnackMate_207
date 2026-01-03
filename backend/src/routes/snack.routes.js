const express = require("express");
const router = express.Router();
const apiKeyMiddleware = require("../middleware/apikey.middleware");
const snackController = require("../controllers/snack.controller");

router.get("/", apiKeyMiddleware, snackController.getAllSnacks);
router.get("/:id", apiKeyMiddleware, snackController.getSnackDetail);

module.exports = router;
