const Event = require("../models/eventModel.js");
// const generateQR =require("../utils/qr.js");
const Booking = require("../models/bookingModel.js");
const Razorpay = require("razorpay");
<<<<<<< HEAD
=======
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const cloudinary = require("../utils/cloudinary");

>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

<<<<<<< HEAD
/* POST /bookings */
=======
/* POST /bookings */ 
 // your Cloudinary upload util

>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
const createBooking = async (req, res) => {
  try {
    const { userDetails, eventId, selectedTickets, totalAmount, paymentMethod } = req.body;

<<<<<<< HEAD
    // Ensure event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Calculate members
    const totalMember = selectedTickets.reduce((acc, curr) => acc + curr.quantity, 0);
    console.log("Total members:", totalMember);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
=======
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

<<<<<<< HEAD
    // Create booking in DB
    const booking = await Booking.create({
=======
    // Create booking
    const booking = new Booking({
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
      eventId,
      userId: req.user.id,
      tickets: selectedTickets,
      totalAmount,
      attendeeInfo: userDetails,
      paymentMethod: paymentMethod || "upi",
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

<<<<<<< HEAD
=======
    // --- QR Code logic ---
    const qrToken = jwt.sign(
      { bookingId: booking._id, eventId, userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    booking.qrToken = qrToken;

    // Generate QR as base64
    const qrDataUrl = await QRCode.toDataURL(qrToken);

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(qrDataUrl, {
      folder: "event_passes",
    });

    booking.qrCode = uploadRes.secure_url;

    await booking.save();

>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
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

<<<<<<< HEAD
=======

>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
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
<<<<<<< HEAD

/* GET /bookings/download/:id (New Function) */
const downloadTicket = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findOne({ bookingId }).populate("eventId");
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access to booking" });
    }

    // In a real application, this is where you'd generate a QR code and a PDF/HTML ticket.
    // We simulate the data required for a PDF ticket.
    const ticketData = {
      bookingId: booking.bookingId,
      attendeeName: booking.attendeeInfo.name,
      eventTitle: booking.eventId.title,
      eventDate: booking.eventId.date,
      eventTime: booking.eventId.time,
      venue: booking.eventId.venue,
      tickets: booking.tickets,
      totalAmount: booking.totalAmount,
      // Placeholder for a generated token/QR code data
      accessCode: `TICKET-${booking.bookingId.slice(2, 10)}`,
      // In a real application, you might embed the event image or a generated QR image URL here.
    };

    // For simplicity, we send the data instead of a generated file.
    // The frontend will treat this successful response as 'download success'.
    res.json({
      success: true,
      message: "Ticket data retrieved successfully (simulated PDF)",
      data: ticketData,
    });

  } catch (err) {
    console.error("Error in downloadTicket:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getBookingById, getBookings, cancelBooking, createBooking, downloadTicket  }
=======
module.exports = { getBookingById, getBookings, cancelBooking, createBooking }
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
