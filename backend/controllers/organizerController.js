  const Event =require("../models/eventModel.js");
  const Booking =require("../models/bookingModel.js");
  
  const getDashboard = async (req, res) => {
  const organizerId = req.user.id;
  const events = await Event.find({ "organizer.id": organizerId });
  const bookings = await Booking.find({ eventId: { $in: events.map((e) => e._id) } });

  // calculate stats ...
  res.json({ success: true, data: { stats: {}, recentEvents: [], recentBookings: [] } });
};

 const getOrganizerEvents = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { "organizer.organizer_Id": req.user.id };
  if (status) filter.status = status;

  console.log(filter);
  const skip = (page - 1) * limit;
  const [events, total] = await Promise.all([
    Event.find(filter).skip(skip).limit(Number(limit)),
    Event.countDocuments(filter),
  ]);
  console.log(events);
  res.json({
    success: true,
    data: {
      events,
      pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total },
    },
  });
};

module.exports={getOrganizerEvents,getDashboard}