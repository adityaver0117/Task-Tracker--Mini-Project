const Task = require('../models/task.model');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;

    const task = new Task({
      title,
      description,
      deadline: new Date(deadline),
      priority: priority || 'Medium',
      owner: req.user._id
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tasks for the logged in user
exports.getTasks = async (req, res) => {
  try {
    // Add filtering options
    const match = {};
    const sort = {};

    // Filter by status if provided
    if (req.query.status) {
      match.status = req.query.status;
    }

    // Filter by priority if provided
    if (req.query.priority) {
      match.priority = req.query.priority;
    }

    // Sort by createdAt or deadline
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find({ owner: req.user._id, ...match })
      .sort(sort)
      .exec();

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'progress', 'deadline'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    updates.forEach(update => {
      if (update === 'deadline' && req.body[update]) {
        task[update] = new Date(req.body[update]);
      } else {
        task[update] = req.body[update];
      }
    });

    await task.save();

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      message: 'Task deleted successfully',
      task
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};