const mongoose = require("mongoose");
const { ticketSchema } = require("./ticketModel");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  price: { type: Number, default: 0 },


  organizer: {
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String, 
    avatar: String
  },

  tickets: [ticketSchema],

  rating: { type: Number, default: 0 },
  attendees: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published", "cancelled"], default: "draft" },
  images: [String],
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
