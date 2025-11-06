const express = require("express");
const router = express.Router();
const controller = require("../Controller/task");

router.get("/:userId", controller.getTasks);
router.get("/swappable/:userId", controller.getSwappableTasks);
router.post("/add", controller.addTask);
router.delete("/:id", controller.deleteTask);
router.post("/requestSwap", controller.requestSwap);
router.get("/incoming/:userId", controller.getIncomingRequests);
router.post("/accept/:requestId", controller.acceptSwap);
router.post("/reject/:requestId", controller.rejectSwap);

module.exports = router;
