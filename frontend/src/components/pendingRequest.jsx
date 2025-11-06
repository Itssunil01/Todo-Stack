import React, { useEffect, useState } from "react";

export default function PendingRequests({ user, refresh }) {
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await fetch(`${BACKEND_URL}/tasks/requests/${user._id}`);
    const data = await res.json();
    setRequests(data);
  };

  const handleAccept = async (id) => {
    await fetch(`${BACKEND_URL}/tasks/acceptSwap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetTaskId: id }),
    });
    alert("Swap accepted!");
    fetchRequests();
    refresh();
  };

  const handleReject = async (id) => {
    await fetch(`${BACKEND_URL}/tasks/rejectSwap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetTaskId: id }),
    });
    alert("Swap rejected.");
    fetchRequests();
    refresh();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Incoming Swap Requests</h2>
      {requests.length === 0 && <p>No pending requests.</p>}
      {requests.map((t) => (
        <div key={t._id} className="p-3 border mb-2 rounded">
          <p className="font-medium">{t.title}</p>
          <p>
            Requested by: <span className="font-semibold">{t.swapRequest.requesterId}</span>
          </p>
          <div className="mt-2">
            <button
              onClick={() => handleAccept(t._id)}
              className="bg-green-500 text-white px-3 py-1 rounded mr-2"
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(t._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
