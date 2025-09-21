const {Event} =require("../models/Event.js");
const generateQR =require("../utils/qr.js");
const {Booking} =require("../models/bookingModel.js");

/* POST /bookings */
const createBooking = async (req, res) => {
  try {
    const { eventId, tickets, attendeeInfo, paymentMethod } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // calculate total
    let total = 0;
    tickets.forEach((t) => {
      const tk = event.tickets.find((x) => x.type === t.type);
      if (tk) total += tk.price * t.quantity;
    });

    const booking = await Booking.create({
      eventId,
      userId: req.user.id,
      tickets,
      totalAmount: total,
      attendeeInfo,
      paymentMethod,
      bookingId: `BK${Date.now()}`,
      qrCode: generateQR(`BK${Date.now()}`),
      status: "confirmed",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
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
  res.json({ success: true, data: { bookings } });
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
module.exports={getBookingById,getBookings,cancelBooking,createBooking}