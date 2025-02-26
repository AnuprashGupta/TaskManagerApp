import express from "express";
import jwt from "jsonwebtoken";
import Task from "../models/Task.js";
import { config } from "dotenv";
config();

const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Create Task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const newTask = new Task({ userId: req.user.userId, title, description });
  await newTask.save();
  res.json(newTask);
});

// Get Tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
});

// Get Single Task
router.get("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
});

// Update Task
router.put("/:id", authMiddleware, async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// Delete Task
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

export default router; 
