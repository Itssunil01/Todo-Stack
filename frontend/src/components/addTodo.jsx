import React, { useState } from "react";

export default function AddTodo({ user, refresh }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("BUSY");
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const addTask = async () => {
    if (!title || !startTime || !endTime)
      return alert("Please enter all fields");
    await fetch(`${BACKEND_URL}/tasks/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, title, startTime, endTime, status }),
    });
    setTitle("");
    setStartTime("");
    setEndTime("");
    setStatus("BUSY");
    refresh();
  };

  return (
    <div className="mb-4 p-3 border rounded">
      <h3 className="font-semibold mb-2">Add Event</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
        className="border p-2 rounded mr-2"
      />
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded mr-2"
      >
        <option value="BUSY">BUSY</option>
        <option value="SWAPPABLE">SWAPPABLE</option>
      </select>
      <button
        onClick={addTask}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Add
      </button>
    </div>
  );
}
