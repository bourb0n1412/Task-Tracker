"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import AddTaskCard from "../components/AddTaskCard";
import AddTaskModal from "../components/AddTaskModal";
import UserInfo from "../components/UserInfo";
import TaskStatistics from "../components/TaskStatistics";
import { auth } from "../components/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const API_URL = "";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => {
      unsubscribe();
      setUser(null); // Den Benutzer-Status nach Unmounten bereinigen
    };
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchAPI = async (url, method = "GET", body = null) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (user) {
        headers["userId"] = user.uid;
      }

      const options = {
        method,
        headers,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to ${method} data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error with ${method} request:`, error);
    }
  };

  const fetchTasks = async () => {
    const data = await fetchAPI(API_URL);
    if (data) setTasks(data);
  };

  const handleAddTask = async (newTask) => {
    if (newTask.dueDate && !isNaN(Date.parse(newTask.dueDate))) {
      newTask.dueDate = new Date(newTask.dueDate).toISOString();
    }

    const result = await fetchAPI(API_URL, "POST", newTask);
    if (result) await fetchTasks();
  };

  const handleUpdateTask = async (updatedTask) => {
    if (updatedTask.dueDate && updatedTask.dueDate !== "No Due Date") {
      const parsedDate = Date.parse(updatedTask.dueDate);
      if (!isNaN(parsedDate)) {
        updatedTask.dueDate = new Date(parsedDate).toISOString();
      } else {
        updatedTask.dueDate = undefined;
      }
    }

    const result = await fetchAPI(
      `${API_URL}/${updatedTask._id}`,
      "PUT",
      updatedTask
    );
    if (result) await fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    const result = await fetchAPI(`${API_URL}/${taskId}`, "DELETE");
    if (result) await fetchTasks();
  };

  const handleDeleteAllTasks = async () => {
    const result = await fetchAPI(API_URL, "DELETE");
    if (result) await fetchTasks();
  };

  const toggleAddModal = () => setShowAddModal((prev) => !prev);

  const formatDate = (dateString) => {
    if (!dateString) return "No Due Date";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return isNaN(date)
      ? "No Due Date"
      : date.toLocaleDateString(undefined, options);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        filter={filterStatus}
        setFilter={setFilterStatus}
        onDeleteAll={handleDeleteAllTasks}
      />
      <div className="flex-1 p-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            👋 Welcome, {user?.displayName}!
          </h1>
          <button
            onClick={toggleAddModal}
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 shadow-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            Add a new Task
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          {["all", "low", "medium", "high"].map((priority) => (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              className={`px-4 py-2 rounded-full border ${filterPriority === priority
                ? "bg-teal-500 text-white"
                : "bg-white text-gray-700 border-gray-300"
                } shadow-sm hover:shadow-md transition duration-200`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {filterPriority === "all" && filterStatus === "all"
            ? "All Tasks"
            : `All ${filterPriority !== "all" ? filterPriority + " priority" : ""
              } ${filterStatus !== "all" ? filterStatus : ""} tasks`.trim()}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 w-full">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={{ ...task, dueDate: formatDate(task.dueDate) }}
              onUpdate={handleUpdateTask}
              onDelete={() => handleDeleteTask(task._id)}
            />
          ))}
          <div onClick={toggleAddModal}>
            <AddTaskCard />
          </div>
        </div>
      </div>
      <div className="w-72 p-6 bg-white shadow-md ml-6 hidden lg:block rounded-md">
        <UserInfo name={user?.displayName} tasks={tasks} />
        <TaskStatistics tasks={tasks} />
      </div>

      {showAddModal && (
        <AddTaskModal onClose={toggleAddModal} onAdd={handleAddTask} />
      )}

      {/* Floating Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed bottom-6 right-6 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
