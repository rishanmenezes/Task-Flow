const express = require("express");
const { body, validationResult } = require("express-validator");
const Task = require("../models/Task");

const router = express.Router();

// --------------- helpers ---------------

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return null;
};

// --------------- GET /api/tasks ---------------

router.get("/", async (req, res) => {
  try {
    const { completed, priority, sort } = req.query;

    const filter = { userId: req.user.id };

    // Optional query filters
    if (completed !== undefined) {
      filter.completed = completed === "true";
    }
    if (priority && ["low", "medium", "high"].includes(priority)) {
      filter.priority = priority;
    }

    // Sorting — default newest first
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "priority") {
      sortOption = { priority: 1, createdAt: -1 };
    }

    const tasks = await Task.find(filter).sort(sortOption);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------- POST /api/tasks ---------------

router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
    body("completed").optional().isBoolean().withMessage("Completed must be a boolean"),
  ],
  async (req, res) => {
    try {
      const validationError = handleValidationErrors(req, res);
      if (validationError) return;

      const { title, description, priority, completed } = req.body;

      const task = await Task.create({
        title,
        description,
        priority,
        completed,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      console.error("Create task error:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// --------------- PUT /api/tasks/:id ---------------

router.put(
  "/:id",
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot exceed 500 characters"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
    body("completed").optional().isBoolean().withMessage("Completed must be a boolean"),
  ],
  async (req, res) => {
    try {
      const validationError = handleValidationErrors(req, res);
      if (validationError) return;

      // Only allow updating these fields
      const allowedUpdates = ["title", "description", "completed", "priority"];
      const updates = {};
      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        updates,
        { new: true, runValidators: true }
      );

      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" });
      }

      res.json({
        success: true,
        message: "Task updated successfully",
        data: task,
      });
    } catch (error) {
      console.error("Update task error:", error.message);
      if (error.kind === "ObjectId") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid task ID" });
      }
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// --------------- DELETE /api/tasks/:id ---------------

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    console.error("Delete task error:", error.message);
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
