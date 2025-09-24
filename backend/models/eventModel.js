const mongoose = require("mongoose");
const { ticketSchema } = require("./ticketModel");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },   // "2024-03-15"
  time: { type: String, required: true }, // "09:00"
  venue: { type: String, required: true },

  // Single main image
  images: [{ type: String, required: true }],

  // Optional ticket price (in case tickets array is not used)
  price: { type: Number, default: 0 },

  organizer: {
    organizer_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true },
    avatar: { type: String }
  },

  tickets: [ticketSchema],

  rating: { type: Number, default: 0 },
  attendees: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);