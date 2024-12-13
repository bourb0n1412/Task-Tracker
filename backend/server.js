require("dotenv").config(); // Hinzufügen, um die .env-Datei zu verwenden
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;; // Verwende PORT aus der .env-Datei oder 5000 als Standardwert

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL })); // Verwende die Adresse des Frontends aus der .env-Datei
app.use(express.json());

// Verbindung zu MongoDB Atlas herstellen
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Verbunden mit MongoDB Atlas"))
  .catch((error) => console.error("Verbindungsfehler:", error));

mongoose.connection.on(
  "error",
  console.error.bind(console, "Verbindungsfehler:")
);

// Mongoose Modell erstellen
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: " " },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  status: { type: String, default: "pending" },
  dueDate: { type: Date },
  userId: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

// CRUD-Operationen

// Alle Aufgaben eines Benutzers abrufen (READ)
app.get("/api/tasks", async (req, res) => {
  const userId = req.header("userId");

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aufgabe aktualisieren (UPDATE)
app.put("/api/tasks/:id", async (req, res) => {
  const userId = req.header("userId");

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    // Entferne ungültige dueDate-Strings wie "No Due Date"
    if (req.body.dueDate === "No Due Date") {
      req.body.dueDate = undefined;
    }

    // Wenn ein `dueDate` angegeben ist, versuche es in ein gültiges Datum umzuwandeln
    if (req.body.dueDate) {
      const parsedDate = new Date(req.body.dueDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      req.body.dueDate = parsedDate;
    }

    // Die aktuelle Aufgabe finden
    const currentTask = await Task.findOne({ _id: taskId, userId });

    if (!currentTask) {
      return res.status(404).json({ error: "Task not found or not authorized" });
    }

    // Aktualisiere die Aufgabe ohne den Status direkt zu ändern
    const updatedFields = { ...req.body };

    // **Neuer Block**: Vorrang für den "completed" Status
    if (req.body.status === "completed") {
      updatedFields.status = "completed";
    } else {
      // Überprüfen, ob das Fälligkeitsdatum in der Vergangenheit liegt
      if (updatedFields.dueDate && updatedFields.dueDate < new Date()) {
        updatedFields.status = "overdue";
      } else if (currentTask.status === "overdue") {
        // Behalte den Status "overdue" bei, wenn die Aufgabe bereits überfällig ist
        updatedFields.status = "overdue";
      }
    }

    // Aktualisiere die Aufgabe
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      updatedFields,
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(400).json({ error: err.message });
  }
});



// Neue Aufgabe hinzufügen (CREATE)
app.post("/api/tasks", async (req, res) => {
  const {
    title,
    description = "",
    priority = "low",
    dueDate,
    status = "pending",
    userId,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const newTask = new Task({
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Error in POST /api/tasks:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Aufgabe löschen (DELETE)
app.delete("/api/tasks/:id", async (req, res) => {
  const userId = req.header("userId");

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId });

    if (!task) {
      return res
        .status(404)
        .json({ error: "Task not found or not authorized" });
    }

    res.status(200).json({ message: "Task deleted successfully", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alle Aufgaben eines Benutzers löschen (DELETE ALL)
app.delete("/api/tasks", async (req, res) => {
  const userId = req.header("userId");

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    await Task.deleteMany({ userId });
    res
      .status(200)
      .json({ message: "All tasks deleted successfully for the user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
