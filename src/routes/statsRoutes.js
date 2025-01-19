const express = require("express");
const { adminStats, hrStats,  } = require("../controllers/statsController");
const { verifyToken, verifyAdmin, verifyHR, verifyEmployee } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/hr", verifyToken, verifyHR, hrStats);
router.get("/admin", verifyToken, verifyAdmin, adminStats);

module.exports = router;