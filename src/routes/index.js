const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const menuRoutes = require("./menuRoutes");
const cartRoutes = require("./cartRoutes");
const stripeRoutes = require("./stripeRoutes");
const orderRoutes = require("./orderRoutes");
const healthRoutes = require("./healthRoutes");
const { authenticateToken } = require("../middleware/authMiddleware");
router.use("/api/auth", authRoutes);
router.use("/api", authenticateToken);
router.use("/api", menuRoutes);
router.use("/api/cart", cartRoutes);
router.use("/api", stripeRoutes);
router.use("/api", orderRoutes);
router.use("/", healthRoutes);

module.exports = router;