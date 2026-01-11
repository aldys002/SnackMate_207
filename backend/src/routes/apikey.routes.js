const express = require("express");
const router = express.Router();
const apikeyController = require("../controllers/apikey.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

// Route untuk generate
router.post("/generate", apikeyController.generateApiKey);

// Route untuk status (CEK BARIS INI, pastikan getKeyStatus tidak typo)
router.get("/status", apikeyController.getKeyStatus); 

module.exports = router;