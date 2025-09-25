const express  =require("express");
const router= express.Router()
const {getBookingById,getBookings,cancelBooking,createBooking} =require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");
const { verifyPayment } = require("../controllers/paymentController");

router.post("/",protect, createBooking);
router.get("/", protect, getBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);
router.post("/verify/payment",protect,verifyPayment);



module.exports = router;
