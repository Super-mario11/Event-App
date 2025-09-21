const {Event} =require("../models/Event.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

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

    if (search)
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];

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

/* GET /events/:id */
 const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* POST /events */
 const createEvent = async (req, res) => {
  try {
      let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "events");
        if (!uploaded || !uploaded.url) {
          throw new ApiError(500, "Image uploaded url missing");
        }
        imageUrls.push(uploaded.url);
      }
    }

    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
      time: req.body.time,
      venue: req.body.venue,
      price: req.body.price,
      organizer: req.body.organizer,
      tickets: req.body.tickets,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* PUT /events/:id */
 const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    let newImages = event.images; // purani images rakhne ke liye
    if (req.files && req.files.length > 0) {
      newImages = [];
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "events");
        if (!uploaded || !uploaded.url) {
          throw new ApiError(500, "Image uploaded url missing");
        }
        newImages.push(uploaded.url);
      }
    }

    const updated = await Event.findByIdAndUpdate(
      eventId,
      {
        $set: {
          title: req.body.title || event.title,
          description: req.body.description || event.description,
          category: req.body.category || event.category,
          date: req.body.date || event.date,
          time: req.body.time || event.time,
          venue: req.body.venue || event.venue,
          price: req.body.price || event.price,
          organizer: req.body.organizer || event.organizer,
          tickets: req.body.tickets || event.tickets,
          images: newImages,
        },
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
/* DELETE /events/:id */
 const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /events/categories */
 const getCategories = async (_, res) => {
  const categories = await Event.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  res.json({
    success: true,
    data: {
      categories: categories.map((c) => ({
        name: c._id,
        count: c.count,
        icon: "tag", // placeholder
      })),
    },
  });
};

module.exports={  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getCategories}