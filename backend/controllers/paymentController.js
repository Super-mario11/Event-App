const Razorpay = require("razorpay");
const Booking = require("../models/bookingModel");
 
// Razorpay instance


// Verify Payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { booking_id, payment_id, signature } = req.body;
console.log(booking_id);
    const crypto = require("crypto");
    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(booking_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Payment verified → create booking
   const booking = await Booking.findOne({bookingId:booking_id})
    console.log(booking);

      if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking  not found for payment"
      });
    }

     booking.status = "confirmed";
    // order.orderDetails.paymentId = payment_id;
    // order.orderDetails.signature = signature;


    res.json({ success: true, message: "Payment verified & booking created", booking });
  } catch (err) {
    next(err);
  }
};
