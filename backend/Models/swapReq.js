const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderTaskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    receiverTaskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
