<<<<<<< HEAD
const express  =require("express");
const router= express.Router()
const {getBookingById,getBookings,cancelBooking,createBooking, downloadTicket } =require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");
const { verifyPayment } = require("../controllers/paymentController");

router.post("/",protect, createBooking);
router.get("/", protect, getBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);
router.post("/verify/payment",protect,verifyPayment);
router.get("/download/:id", protect, downloadTicket); // <-- ADDED NEW ROUTE


=======
// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { getBookingById, getBookings, cancelBooking, createBooking } = require("../controllers/bookingController");
const { verifyAttendance, getAttendanceList } = require("../controllers/attendanceController");
const { protect } = require("../middlewares/authMiddleware");
const { verifyPayment } = require("../controllers/paymentController");

router.post("/", protect, createBooking);
router.get("/", protect, getBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);
router.post("/verify/payment", protect, verifyPayment);

// New attendance routes
router.post("/attendance/verify", protect, verifyAttendance);
router.get("/attendance/:eventId", protect, getAttendanceList);
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c

module.exports = router;
