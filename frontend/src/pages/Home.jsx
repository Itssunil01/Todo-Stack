import React, { useState, useEffect } from "react";
import AddTodo from "../components/AddTodo";
import SwapList from "../components/swapList";
import IncomingSwapRequests from "../components/incomingReq";
import Nav from "../components/navbar";

export default function Home() {
  const [user, setUser] = useState({ _id: "USER1_ID", username: "User1" }); // temporary user
  const [todos, setTodos] = useState([]);
  const [swappables, setSwappables] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const fetchData = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${user._id}`);
      const data = await res.json();
      setTodos(data);

      const swapRes = await fetch(`${BACKEND_URL}/tasks/swappable/${user._id}`);
      const swapData = await swapRes.json();
      setSwappables(swapData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const deleteTask = async (id) => {
    await fetch(`${BACKEND_URL}/tasks/${id}`, { method: "DELETE" });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Nav />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">🗓️ SlotSwapper Todo App</h1>

        <AddTodo user={user} refresh={fetchData} />

        <h3 className="font-semibold mt-4 mb-2">Your Events</h3>
        {todos.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          todos.map((t) => (
            <div
              key={t._id}
              className="border p-2 mb-2 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{t.title}</p>
                <p className="text-sm">
                  Time: {new Date(t.startTime).toLocaleTimeString()} -{" "}
                  {new Date(t.endTime).toLocaleTimeString()}
                </p>
                <p className="text-sm">
                  Status: <strong>{t.status}</strong>
                </p>
              </div>
              <button
                onClick={() => deleteTask(t._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}

        <SwapList swappables={swappables} user={user} refresh={fetchData} />

        <IncomingSwapRequests user={user} refresh={fetchData} />
      </div>
    </>
  );
}
