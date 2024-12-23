import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [showEditModal, setShowEditModal] = useState(false);

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.volume = 0.1;
    audio.play();
  };

  // Funktion zum Markieren der Aufgabe als abgeschlossen
  const markAsCompleted = () => {
    playSound("/complete.mp3");
    const updatedTask = {
      ...task,
      status: "completed",
    };
    onUpdate(updatedTask);
  };

  return (
    <div
      className={`p-4 shadow rounded-md border border-gray-200 flex flex-col justify-between w-full h-64 ${
        task.status === "completed" ? "bg-green-100" : "bg-white"
      }`}
    >
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-2">{task.title}</h2>
        <p className="text-gray-700 mb-4 overflow-hidden line-clamp-3">
          {task.description}
        </p>
      </div>
      <div className="text-sm text-gray-500 flex justify-between items-center mt-4">
        <span>{task.dueDate}</span>
        <span
          className={`capitalize ${
            task.priority === "high"
              ? "text-red-500"
              : task.priority === "medium"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {task.priority}
        </span>
      </div>
      <div className="flex space-x-2 mt-4">
        {/* Mark as completed (Check in grün) */}
        <button
          onClick={markAsCompleted}
          className={`text-green-500 hover:text-green-600 ${
            task.status === "completed" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={task.status === "completed"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
        {/* Edit Task */}
        <button
          onClick={() => setShowEditModal(true)}
          className="text-gray-500 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
        {/* Delete Task */}
        <button
          onClick={() => onDelete(task._id)}
          className="text-red-500 hover:text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
