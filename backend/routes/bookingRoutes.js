const express  =reuire("express");
const router= express.Route()
const 
{getBookingById,getBookings,cancelBooking,createBooking}
 =reuire( "../controllers/");
const { protect } =require("../middlewares/authMiddleware");
router.post("/", protect, createBooking);
router.get("/", protect, getBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);



module.exports = router;
