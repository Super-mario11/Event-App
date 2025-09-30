const Event = require("../models/eventModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { sendNewEventEmail } = require("../utils/sendEmail"); // Import new email function

// ✅ GET /events
const getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      location,
      date,
      priceMin,
      priceMax,
      sortBy,
      featured,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (location) filter.venue = { $regex: location, $options: "i" };
    if (date) filter.date = date;
    if (featured) filter.featured = featured === "true";

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    const sortOptions = {
      date: { date: 1 },
      price: { price: 1 },
      rating: { rating: -1 },
      popular: { attendees: -1 },
    }[sortBy] || { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [events, totalItems] = await Promise.all([
      Event.find(filter).sort(sortOptions).skip(skip).limit(Number(limit)),
      Event.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          hasNext: page * limit < totalItems,
          hasPrev: page > 1,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET /events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createEvent = async (req, res) => {
  try {
    console.log("User:", req.user);

    // Upload images
    let imageUrls = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "events");
        if (uploaded?.url) imageUrls.push(uploaded.url);
      }
    }

    // Parse form-data JSON
    let data = req.body;

    if (typeof req.body.eventData === "string") {
      data = JSON.parse(req.body.eventData);
    }
    console.log(data);
    // Explicitly map fields
    const newEvent = {
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.date,
      time: data.time,
      venue: data.location || data.venue, // your schema uses 'venue'
      images: imageUrls, // all images
      price: parseFloat(data.generalPrice) || 0,
      organizer: {
        organizer_Id: req.user.id, // <-- CRITICAL FIX: Link event to organizer
        name: req.user.name,
        avatar: req.user.avatar || "",
      },
      tickets: [],
      featured: data.featured || false,
      attendees: data.attendees || 0,
      rating: 0,
    };

    if (data.generalPrice && parseFloat(data.generalPrice) > 0) {
      newEvent.tickets.push({
        type: "General Admission",
        price: parseFloat(data.generalPrice),
        quantity: parseInt(data.generalQuantity) || 100,
        sold: 0,
      });
    }

    if (data.vipPrice && parseFloat(data.vipPrice) > 0) {
      newEvent.tickets.push({
        type: "VIP",
        price: parseFloat(data.vipPrice),
        quantity: parseInt(data.vipQuantity) || 50,
        sold: 0,
      });
    }

    // Create in DB
    const event = await Event.create(newEvent);

    // Send New Event Email (Mock logic: sending to organizer for demo)
    await sendNewEventEmail({
      email: req.user.email,
      eventTitle: event.title,
      eventDate: event.date,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PUT /events/:id
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    let newImages = event.images;
    if (req.files?.length > 0) {
      newImages = [];
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "events");
        if (uploaded?.url) newImages.push(uploaded.url);
      }
    }

    const updated = await Event.findByIdAndUpdate(
      eventId,
      { ...req.body, images: newImages },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ DELETE /events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET /events/categories
const getCategories = async (_, res) => {
  try {
    const categories = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: categories.map((c) => ({
        name: c._id,
        count: c.count,
        icon: "tag", // placeholder
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getCategories,
};
