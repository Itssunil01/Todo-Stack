// src/components/swapList.jsx
import React from "react";

export default function SwapList({ swappables, user, refresh }) {
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

 const sendSwapRequest = async (myTask, otherTask) => {
  await fetch(`${BACKEND_URL}/swap/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderId: user._id,
      receiverId: otherTask.userId,
      senderTaskId: myTask._id,
      receiverTaskId: otherTask._id,
    }),
  });
  refresh();
};


  return (
    <div className="mt-4 p-3 border rounded">
      <h3 className="font-semibold text-lg mb-2">
        <span className="text-green-600">🟢</span> Available Swaps
      </h3>

      {swappables.length === 0 ? (
        <p className="text-sm text-gray-500">
          No swappable tasks from other users right now.
        </p>
      ) : (
        swappables.map((task) => (
          <div
            key={task._id}
            className="border p-2 rounded mb-2 flex justify-between"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm">
                {new Date(task.startTime).toLocaleTimeString()} -{" "}
                {new Date(task.endTime).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => sendSwapRequest(task)}
              className="bg-orange-500 text-white px-3 py-1 rounded"
            >
              Request Swap
            </button>
          </div>
        ))
      )}
    </div>
  );
}
