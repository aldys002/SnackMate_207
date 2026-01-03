const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const adminController = require("../controllers/admin.controller");

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  adminController.getUsers
);

router.get(
  "/apikeys",
  authMiddleware,
  adminMiddleware,
  adminController.getApiKeys
);

router.post(
  "/snacks",
  authMiddleware,
  adminMiddleware,
  adminController.createSnack
);

module.exports = router;
