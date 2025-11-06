// src/components/IncomingSwapRequests.jsx
import React, { useEffect, useState } from "react";

export default function IncomingSwapRequests({ user, refresh }) {
  const [requests, setRequests] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/incoming/${user._id}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await fetch(`${BACKEND_URL}/tasks/${action}/${id}`, { method: "POST" });
      fetchRequests();
      refresh(); // refresh main task list after swap
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="mt-4 p-3 border rounded">
      <h3 className="font-semibold text-lg mb-2">Incoming Swap Requests</h3>

      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">No pending requests.</p>
      ) : (
        requests.map((req) => (
          <div
            key={req._id}
            className="border p-2 rounded mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {req.requesterId?.username || "Unknown user"} wants to swap:
              </p>
              <p className="text-sm">
                <strong>Their Task:</strong> {req.requesterTaskId?.title} (
                {new Date(req.requesterTaskId?.startTime).toLocaleTimeString()} -{" "}
                {new Date(req.requesterTaskId?.endTime).toLocaleTimeString()})
              </p>
              <p className="text-sm">
                <strong>Your Task:</strong> {req.receiverTaskId?.title} (
                {new Date(req.receiverTaskId?.startTime).toLocaleTimeString()} -{" "}
                {new Date(req.receiverTaskId?.endTime).toLocaleTimeString()})
              </p>
            </div>
            <div>
              <button
                onClick={() => handleAction(req._id, "accept")}
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction(req._id, "reject")}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
