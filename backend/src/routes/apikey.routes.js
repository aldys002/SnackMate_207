const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const apiKeyController = require("../controllers/apikey.controller");

router.post(
  "/generate",
  authMiddleware,
  apiKeyController.generateApiKey
);

module.exports = router;
