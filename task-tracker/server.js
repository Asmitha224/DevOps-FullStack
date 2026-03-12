const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Task = require("./models/Task");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML files
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/tasktracker");

// Home route
app.get("/", (req, res) => {
  res.send("Task Tracker Server is Running");
});

/* ---------------- API ENDPOINTS ---------------- */

// POST - Add Task
app.post("/tasks", async (req, res) => {
  const task = new Task({
    title: req.body.title
  });
  await task.save();
  res.send("Task added successfully");
});

// GET - View All Tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// GET - View Task by ID
app.get("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
});

// PUT - Update Task Status
app.put("/tasks/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.send("Task updated successfully");
});

// DELETE - Delete Task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Task deleted successfully");
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});