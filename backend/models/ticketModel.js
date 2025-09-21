const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Number, required: true },
  total: { type: Number, required: true },
});

module.exports = { ticketSchema }; // sirf schema export karo
