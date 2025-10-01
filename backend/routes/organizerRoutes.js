const express  =require("express");
<<<<<<< HEAD
const { getDashboard, getOrganizerEvents, getOrganizerBookings, exportBookingData } = require("../controllers/organizerController.js");
=======

const { getDashboard, getOrganizerEvents } = require("../controllers/organizerController.js");
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
const { protect, organizerOnly } =require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/dashboard", protect,organizerOnly,getDashboard);
router.get("/events", protect, organizerOnly, getOrganizerEvents);

<<<<<<< HEAD
router.get("/export-data", protect, organizerOnly, exportBookingData); // <-- NEW EXPORT ROUTE

module.exports = router;
=======
module.exports = router;
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
