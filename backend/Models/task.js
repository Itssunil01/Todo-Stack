const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"],
    default: "BUSY",
  },
  userId: String,
  swapRequest: {
    requesterId: { type: String, default: null },
    requesterTaskId: { type: String, default: null },
    status: { type: String, enum: ["NONE", "PENDING", "ACCEPTED", "REJECTED"], default: "NONE" },
  },
});

const task = mongoose.model("task", taskSchema);

module.exports = task;
