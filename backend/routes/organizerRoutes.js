const express  =require("express");

const { getDashboard, getOrganizerEvents } = require("../controllers/organizerController.js");
const { protect, organizerOnly } =require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/dashboard", protect,organizerOnly,getDashboard);
router.get("/events", protect, organizerOnly, getOrganizerEvents);

module.exports = router;
