export default function TodoList({ todos, refresh }) {
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const deleteTask = async (id) => {
    await fetch(`${BACKEND_URL}/tasks/${id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div>
      <h2 className="text-xl mt-4 mb-2 font-semibold">Your Events</h2>
      {todos.map((t) => (
        <div
          key={t._id}
          className="p-2 border mb-1 rounded flex justify-between items-center"
        >
          <div>
            <b>{t.title}</b> <br />
            <p>
              Time:{" "}
              {new Date(t.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {new Date(t.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <br />
            Status: <span className="font-semibold">{t.status}</span>
          </div>
          <button
            onClick={() => deleteTask(t._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
