const Razorpay = require("razorpay");
const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
exports.createOrder = async (req, res, next) => {
  try {
    const { eventId, tickets } = req.body;

    // Fetch event price
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    let totalAmount = 0;
    tickets.forEach(ticket => {
      const eventTicket = event.tickets.find(t => t.type === ticket.type);
      if (!eventTicket) throw { status: 400, message: `Ticket type ${ticket.type} not found` };
      if (ticket.quantity > eventTicket.available) throw { status: 400, message: `Not enough tickets for ${ticket.type}` };
      totalAmount += ticket.quantity * eventTicket.price;
    });

    // Create Razorpay order
    const options = {
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order,
      totalAmount,
    });
  } catch (err) {
    next(err);
  }
};

// Verify Payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, bookingData } = req.body;

    const crypto = require("crypto");
    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Payment verified → create booking
    const booking = await Booking.create({
      ...bookingData,
      paymentId,
      status: "confirmed",
    });

    res.json({ success: true, message: "Payment verified & booking created", booking });
  } catch (err) {
    next(err);
  }
};
