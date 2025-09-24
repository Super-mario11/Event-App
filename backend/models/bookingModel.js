const mongoose = require("mongoose");
const { ticketSchema } = require("./ticketModel");

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tickets: [ticketSchema], // array of subdocuments

    totalAmount: {
      type: Number,
      required: true,
    },

    attendeeInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi","bank"],
      required: true,
    },

    status: {
      type: String,
      enum: ["created","confirmed", "cancelled", "refunded"],
      default: "confirmed",
    },

    razorpayOrderId: {
  type: String,
  unique: true,  // optional, but ensures no duplicates
},
    qrCode: String,
    paymentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
