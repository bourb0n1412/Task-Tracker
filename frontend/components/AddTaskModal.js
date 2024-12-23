import React, { useState } from "react";
import { auth } from "../components/firebase"; // Firebase Auth importieren

export default function AddTaskModal({ onClose, onAdd }) {
  const initialState = {
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
  };
  const [task, setTask] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    if (!task.title.trim()) {
      alert("Title is required");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("User not authenticated");
      return;
    }

    const newTask = {
      ...task,
      description: task.description.trim() || "",
      dueDate:
        task.dueDate && task.dueDate !== "No Due Date"
          ? task.dueDate
          : undefined,
      status:
        task.dueDate && new Date(task.dueDate) < new Date()
          ? "overdue"
          : "pending",
      userId: currentUser.uid,
    };

    console.log("New Task:", newTask);
    onAdd(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md w-full max-w-3xl h-auto max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleInputChange}
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
            name="dueDate"
            value={task.dueDate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
