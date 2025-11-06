const express = require("express");
const mongoose = require("mongoose");
const SwapRequest = require("../Models/swapReq");
const Task = require("../Models/task");

const router = express.Router();

/**
 * Send a swap request
 */
router.post("/request", async (req, res) => {
  try {
    const { senderId, receiverId, senderTaskId, receiverTaskId } = req.body;

    if (![senderId, receiverId, senderTaskId, receiverTaskId].every(mongoose.isValidObjectId)) {
      return res.status(400).json({ success: false, message: "Invalid ID(s) provided" });
    }

    // Check if already requested
    const existing = await SwapRequest.findOne({
      senderId,
      receiverId,
      senderTaskId,
      receiverTaskId,
      status: "PENDING",
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Request already sent" });
    }

    const swapRequest = new SwapRequest({
      senderId,
      receiverId,
      senderTaskId,
      receiverTaskId,
    });

    await swapRequest.save();

    // Mark both tasks as SWAP_PENDING
    await Task.findByIdAndUpdate(senderTaskId, { status: "SWAP_PENDING" });
    await Task.findByIdAndUpdate(receiverTaskId, { status: "SWAP_PENDING" });

    res.json({ success: true, message: "Swap request sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Accept swap request — swaps the time slots
 */
router.post("/accept/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await SwapRequest.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    // Fetch both tasks
    const senderTask = await Task.findById(request.senderTaskId);
    const receiverTask = await Task.findById(request.receiverTaskId);

    if (!senderTask || !receiverTask)
      return res.status(404).json({ success: false, message: "Tasks not found" });

    // Swap their time slots
    const tempStart = senderTask.startTime;
    const tempEnd = senderTask.endTime;

    senderTask.startTime = receiverTask.startTime;
    senderTask.endTime = receiverTask.endTime;
    receiverTask.startTime = tempStart;
    receiverTask.endTime = tempEnd;

    // Update both tasks
    senderTask.status = "BUSY";
    receiverTask.status = "BUSY";
    await senderTask.save();
    await receiverTask.save();

    // Mark request as accepted
    request.status = "ACCEPTED";
    await request.save();

    res.json({ success: true, message: "Swap completed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Reject swap request
 */
router.post("/reject/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await SwapRequest.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = "REJECTED";
    await request.save();

    // Reset task statuses
    await Task.findByIdAndUpdate(request.senderTaskId, { status: "SWAPPABLE" });
    await Task.findByIdAndUpdate(request.receiverTaskId, { status: "SWAPPABLE" });

    res.json({ success: true, message: "Swap rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Get pending swap requests for a user
 */
router.get("/incoming/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await SwapRequest.find({
      receiverId: userId,
      status: "PENDING",
    })
      .populate("senderId", "email username")
      .populate("senderTaskId")
      .populate("receiverTaskId");

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
