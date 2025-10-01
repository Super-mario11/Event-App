<<<<<<< HEAD
=======
// models/bookingModel.js
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
const mongoose = require("mongoose");
const { ticketSchema } = require("./ticketModel");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
<<<<<<< HEAD
      default: () => `BK${Date.now()}${Math.floor(Math.random() * 1000)}`, // readable booking ID
=======
      default: () => `BK${Date.now()}${Math.floor(Math.random() * 1000)}`,
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
    },

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

<<<<<<< HEAD
    tickets: [ticketSchema], // array of subdocuments

    totalAmount: {
      type: Number,
      required: true,
    },
=======
    tickets: [ticketSchema],

    totalAmount: { type: Number, required: true },
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c

    attendeeInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "bank"],
      default: "upi",
    },

    status: {
      type: String,
      enum: ["created", "confirmed", "cancelled", "refunded"],
      default: "created",
    },

    razorpayOrderId: { type: String, unique: true },
<<<<<<< HEAD
    paymentId: { type: String }, // Razorpay payment id
    signature: { type: String }, // Razorpay signature

    qrCode: String,
=======
    paymentId: { type: String },
    signature: { type: String },
 
    qrCode: String, 
    qrToken: String, 
    attended: { type: Boolean, default: false },
    checkInTime: { type: Date },
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
