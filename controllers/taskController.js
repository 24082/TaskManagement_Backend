const Task = require("../models/Task");


// Create Task
exports.createTask = async (req, res) => {
  try {

    const { title, description, status, priority } = req.body;


    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });

  } catch (error) {

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



// Get All Tasks (Pagination + Search)
exports.getAllTasks = async (req, res) => {

  try {

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const whereCondition = {};

    if (req.query.search) {
      whereCondition.title = {
        $regex: req.query.search,
        $options: "i"
      };
    }

    if (req.query.status) {
      whereCondition.status = req.query.status;
    }

    if (req.query.priority) {
      whereCondition.priority = req.query.priority;
    }

    const totalCount = await Task.countDocuments(whereCondition);

    const tasks = await Task.find(whereCondition)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const formattedTasks = tasks.map(task => ({

      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt?.toISOString().split("T")[0],
      updatedAt: task.updatedAt

    }));

    res.status(200).json({
      success: true,
      data: formattedTasks,
      totalCount
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};



// Get Single Task
exports.getTaskById = async (req, res) => {

  try {

    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};



// Update Task
exports.updateTask = async (req, res) => {

  try {

    const { title, description, status, priority } = req.body;

    if (title === "") {
      return res.status(400).json({
        success: false,
        message: "Task title cannot be empty"
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task
    });

  } catch (error) {

    if (error.name === "ValidationError") {

      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};



// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Count total tasks
    const total = await Task.countDocuments();

    // Count by status
    const completed = await Task.countDocuments({ status: "Completed" });
    const pending = await Task.countDocuments({ status: "Pending" });
    const inProgress = await Task.countDocuments({ status: "In Progress" });

    // Count by priority (optional)
    const highPriority = await Task.countDocuments({ priority: "High" });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
        highPriority
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



// Delete Task
exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};
