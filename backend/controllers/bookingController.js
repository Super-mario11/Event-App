const Event = require("../models/eventModel.js");
// const generateQR =require("../utils/qr.js");
const Booking = require("../models/bookingModel.js");
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* POST /bookings */
const createBooking = async (req, res) => {
  try {
    const { userDetails, eventId, selectedTickets, totalAmount, paymentMethod } = req.body;

    // Ensure event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Calculate members
    const totalMember = selectedTickets.reduce((acc, curr) => acc + curr.quantity, 0);
    console.log("Total members:", totalMember);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Create booking in DB
    const booking = await Booking.create({
      eventId,
      userId: req.user.id,
      tickets: selectedTickets,
      totalAmount,
      attendeeInfo: userDetails,
      paymentMethod: paymentMethod || "upi",
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
      razorpayOrder,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* GET /bookings */
const getBookings = async (req, res) => {
  const { status, upcoming, past } = req.query;
  const filter = { userId: req.user.id };
  if (status) filter.status = status;
  // add date filters if needed
  const bookings = await Booking.find(filter).populate("eventId");
  const formatted = bookings.map(b => ({
  bookingId: b.bookingId,
  status: b.status,
  totalPaid: b.totalAmount,
  eventTitle: b.eventId.title,
  eventDate: b.eventId.date,
  eventTime: b.eventId.time,
  venue: b.eventId.venue,
  image: b.eventId.images[0],
  tickets: b.tickets.map(t => ({
    type: t.type,
    quantity: t.quantity,
    price: t.price
  }))
}));
  res.json({ success: true, bookings:{formatted}  });
};

/* GET /bookings/:id */
const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("eventId");
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
  res.json({ success: true, data: booking });
};

/* PUT /bookings/:id/cancel */
const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
  booking.status = "cancelled";
  await booking.save();
  res.json({
    success: true,
    message: "Booking cancelled successfully",
    data: {
      id: booking._id,
      status: booking.status,
      refundAmount: booking.totalAmount,
      refundStatus: "processed",
    },
  });
};
module.exports = { getBookingById, getBookings, cancelBooking, createBooking }