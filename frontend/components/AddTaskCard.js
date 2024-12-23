import React from 'react';

export default function AddTaskCard() {
  return (
    <div className="h-64 w-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-400 rounded-md">
      <button className="text-gray-500 hover:text-gray-700">
        Add New Task
      </button>
    </div>
  );
}
