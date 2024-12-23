import React from 'react';

export default function UserInfo({ name, tasks }) {
  const activeTasks = tasks.filter((task) => task.status === 'pending').length;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2">Hello, {name}!</h2>
      <p className="text-gray-600">You have {activeTasks} active tasks</p>
    </div>
  );
}