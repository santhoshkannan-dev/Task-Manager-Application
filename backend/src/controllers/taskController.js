const { query } = require('../db');
const {
  validateCreateTask,
  validateUpdateTask,
} = require('../validators/taskValidator');

/**
 * GET /api/tasks
 * Returns all tasks, with optional filters:
 * - search: keyword matched in title or description (case-insensitive)
 * - priority: LOW | MEDIUM | HIGH
 * - completed: true | false
 * - sort: 'newest' | 'oldest' | 'priority'
 */
async function getAllTasks(req, res, next) {
  try {
    const { search, priority, completed, sort } = req.query;

    let sql = 'SELECT * FROM tasks';
    const conditions = [];
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    if (priority && ['LOW', 'MEDIUM', 'HIGH'].includes(priority.toUpperCase())) {
      params.push(priority.toUpperCase());
      conditions.push(`priority = $${params.length}`);
    }

    if (completed !== undefined && completed !== '') {
      if (completed === 'true' || completed === true) {
        conditions.push(`completed = TRUE`);
      } else if (completed === 'false' || completed === false) {
        conditions.push(`completed = FALSE`);
      }
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting
    switch (sort) {
      case 'oldest':
        sql += ' ORDER BY created_at ASC, id ASC';
        break;
      case 'priority':
        sql += ` ORDER BY CASE priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 ELSE 4 END ASC, created_at DESC`;
        break;
      case 'newest':
      default:
        sql += ' ORDER BY created_at DESC, id DESC';
        break;
    }

    const result = await query(sql, params);
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/:id
 * Returns a single task by ID
 */
async function getTaskById(req, res, next) {
  try {
    const taskId = req.validatedId;
    const result = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${taskId} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks
 * Creates a new task
 */
async function createTask(req, res, next) {
  try {
    const validation = validateCreateTask(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(' '),
        details: validation.errors,
      });
    }

    const { title, description, priority } = validation.data;

    const result = await query(
      `INSERT INTO tasks (title, description, priority, completed)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [title, description, priority]
    );

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/tasks/:id
 * Updates an existing task
 */
async function updateTask(req, res, next) {
  try {
    const taskId = req.validatedId;

    // Check if task exists first
    const existing = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${taskId} not found.`,
      });
    }

    const validation = validateUpdateTask(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(' '),
        details: validation.errors,
      });
    }

    const currentTask = existing.rows[0];
    const updatedTitle = validation.data.title !== undefined ? validation.data.title : currentTask.title;
    const updatedDescription = validation.data.description !== undefined ? validation.data.description : currentTask.description;
    const updatedPriority = validation.data.priority !== undefined ? validation.data.priority : currentTask.priority;
    const updatedCompleted = validation.data.completed !== undefined ? validation.data.completed : currentTask.completed;

    const result = await query(
      `UPDATE tasks
       SET title = $1, description = $2, priority = $3, completed = $4
       WHERE id = $5
       RETURNING *`,
      [updatedTitle, updatedDescription, updatedPriority, updatedCompleted, taskId]
    );

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/tasks/:id/complete
 * Toggles or sets completion status for a task
 */
async function toggleCompleteTask(req, res, next) {
  try {
    const taskId = req.validatedId;

    // Check if task exists
    const existing = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${taskId} not found.`,
      });
    }

    const currentTask = existing.rows[0];
    let newCompleted;

    if (req.body && typeof req.body.completed === 'boolean') {
      newCompleted = req.body.completed;
    } else {
      newCompleted = !currentTask.completed;
    }

    const result = await query(
      `UPDATE tasks
       SET completed = $1
       WHERE id = $2
       RETURNING *`,
      [newCompleted, taskId]
    );

    return res.status(200).json({
      success: true,
      message: `Task marked as ${newCompleted ? 'completed' : 'pending'}.`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/tasks/:id
 * Deletes a task
 */
async function deleteTask(req, res, next) {
  try {
    const taskId = req.validatedId;

    const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${taskId} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/stats/summary
 * Provides aggregated counts directly from PostgreSQL for analytics and dashboard
 */
async function getTaskSummary(req, res, next) {
  try {
    const summaryQuery = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE completed = true)::int AS completed,
        COUNT(*) FILTER (WHERE completed = false)::int AS pending,
        COUNT(*) FILTER (WHERE priority = 'HIGH')::int AS high_priority,
        COUNT(*) FILTER (WHERE priority = 'MEDIUM')::int AS medium_priority,
        COUNT(*) FILTER (WHERE priority = 'LOW')::int AS low_priority
      FROM tasks;
    `;
    const result = await query(summaryQuery);
    const stats = result.rows[0];

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        ...stats,
        completion_rate: completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleCompleteTask,
  deleteTask,
  getTaskSummary,
};

