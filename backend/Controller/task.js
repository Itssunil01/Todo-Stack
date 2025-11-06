const Task = require("../Models/task");
const SwapRequest = require("../Models/swapReq");

// Get tasks for one user
exports.getTasks = async (req, res) => {
  const { userId } = req.params;
  const tasks = await Task.find({ userId });
  res.json(tasks);
};

// Get swappable tasks from *other* users
exports.getSwappableTasks = async (req, res) => {
  const { userId } = req.params;
  const tasks = await Task.find({ userId: { $ne: userId }, status: "SWAPPABLE" });
  res.json(tasks);
};

// Add new task
exports.addTask = async (req, res) => {
  const { userId, title, startTime, endTime, status } = req.body;
  const task = new Task({ userId, title, startTime, endTime, status });
  await task.save();
  res.json({ message: "Task added successfully", task });
};

// Delete task
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};

// Request swap
exports.requestSwap = async (req, res) => {
  const { requesterId, taskId, ownerId } = req.body;

  const ownerTask = await Task.findById(taskId);
  const requesterTask = await Task.findOne({ userId: requesterId, status: "SWAPPABLE" });

  if (!ownerTask || !requesterTask) return res.status(400).json({ message: "Tasks not found" });

  const swapRequest = new SwapRequest({
    requesterId,
    receiverId: ownerId,
    requesterTaskId: requesterTask._id,
    receiverTaskId: ownerTask._id,
  });

  await swapRequest.save();
  res.json({ message: "Swap request sent!" });
};

// Get incoming swap requests
exports.getIncomingRequests = async (req, res) => {
  const { userId } = req.params;
  const requests = await SwapRequest.find({ receiverId: userId, status: "PENDING" })
    .populate("requesterTaskId")
    .populate("receiverTaskId")
    .populate("requesterId", "username");
  res.json(requests);
};

// Accept swap (actually swap task times)
exports.acceptSwap = async (req, res) => {
  const { requestId } = req.params;
  const request = await SwapRequest.findById(requestId);
  if (!request) return res.status(404).json({ message: "Request not found" });

  const requesterTask = await Task.findById(request.requesterTaskId);
  const receiverTask = await Task.findById(request.receiverTaskId);

  const tempStart = requesterTask.startTime;
  const tempEnd = requesterTask.endTime;

  requesterTask.startTime = receiverTask.startTime;
  requesterTask.endTime = receiverTask.endTime;

  receiverTask.startTime = tempStart;
  receiverTask.endTime = tempEnd;

  await requesterTask.save();
  await receiverTask.save();

  request.status = "ACCEPTED";
  await request.save();

  res.json({ message: "Tasks swapped successfully!" });
};

// Reject swap
exports.rejectSwap = async (req, res) => {
  const { requestId } = req.params;
  await SwapRequest.findByIdAndUpdate(requestId, { status: "REJECTED" });
  res.json({ message: "Swap rejected" });
};
