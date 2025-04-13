const express = require('express');
const taskController = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// All task routes are protected by authentication middleware
router.use(auth);

// Create a new task
router.post('/', taskController.createTask);

// Get all tasks for the logged in user
router.get('/', taskController.getTasks);

// Get a single task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.patch('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;