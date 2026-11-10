const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateIdParam } = require('../middleware/validateRequest');

// Aggregate statistics endpoint (must be declared before :id route)
router.get('/stats/summary', taskController.getTaskSummary);

// Standard task CRUD endpoints
router.get('/', taskController.getAllTasks);
router.get('/:id', validateIdParam, taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', validateIdParam, taskController.updateTask);
router.patch('/:id/complete', validateIdParam, taskController.toggleCompleteTask);
router.delete('/:id', validateIdParam, taskController.deleteTask);

module.exports = router;
