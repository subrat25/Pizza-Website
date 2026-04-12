const express = require("express");
const router = express.Router();

const healthController = require("../controller/healthController");

router.get("/health", healthController.getHealth);
router.get("/full-health", healthController.getHealth2);
module.exports = router;