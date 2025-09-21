const express  =reuire("express");
const {
 getDashboard, getOrganizerEvents 
} =reuire( "../controllers/organizerController.js");
const { protect, organizerOnly } =require("../middlewares/auth.js");

const router = express.Router();

router.get("/dashboard", protect, organizerOnly, getDashboard);
router.get("/events", protect, organizerOnly, getOrganizerEvents);

module.exports = router;
