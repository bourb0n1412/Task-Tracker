import React, { useState } from "react";
import { auth } from "../components/firebase"; // Firebase Auth importieren

export default function EditTaskModal({ task, onClose, onUpdate }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate && task.dueDate !== "No Due Date"
      ? task.dueDate.slice(0, 10)
      : ""
  );
  const [status, setStatus] = useState(
    task.status === "completed" ? "completed" : "pending"
  );

  const handleUpdate = () => {
    // Hole den aktuell angemeldeten Benutzer
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("User not authenticated");
      return;
    }

    // Erstelle das aktualisierte Task-Objekt
    const updatedTask = {
      ...task,
      title,
      description: description.trim() || "",
      priority,
      dueDate: dueDate && dueDate !== "" ? dueDate : undefined, // Setze dueDate auf undefined, wenn kein gültiges Datum angegeben ist
      status,
      userId: currentUser.uid, // Füge die Nutzer-ID hinzu
    };

    console.log("Updated Task:", updatedTask);
    onUpdate(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md w-full max-w-3xl h-auto max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Task Completed
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="pending">No</option>
            <option value="completed">Yes</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
          >
            Update Task
          </button>
        </div>
      </div>
    </div>
  );
}
