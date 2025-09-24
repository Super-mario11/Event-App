const Event = require("../models/eventModel.js");
const Booking = require("../models/bookingModel.js");

// Get organizer dashboard stats
const getDashboard = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Fetch all events by this organizer
    const events = await Event.find({ "organizer.organizer_Id": organizerId });

    // Fetch all bookings for these events
    const bookings = await Booking.find({
      eventId: { $in: events.map((e) => e._id) },
    });

    // --- Stats calculation ---
    const totalEvents = events.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const ticketsSold = bookings.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const avgRating =
      events.length > 0
        ? (events.reduce((sum, e) => sum + (e.rating || 0), 0) / events.length).toFixed(1)
        : 0;

    // --- Recent events & bookings ---
    const recentEvents = events
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        stats: { totalEvents, totalRevenue, ticketsSold, avgRating },
        recentEvents,
        recentBookings,
      },
    });
  } catch (err) {
    console.error("Error in getDashboard:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all organizer events with optional status filter & pagination
const getOrganizerEvents = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { "organizer.organizer_Id": req.user.id };

    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter).skip(skip).limit(Number(limit)),
      Event.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      },
    });
  } catch (err) {
    console.error("Error in getOrganizerEvents:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Optionally, get recent bookings for organizer
const getOrganizerBookings = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await Event.find({ "organizer.organizer_Id": organizerId });

    const bookings = await Booking.find({
      eventId: { $in: events.map((e) => e._id) },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (err) {
    console.error("Error in getOrganizerBookings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getDashboard,
  getOrganizerEvents,
  getOrganizerBookings,
};
