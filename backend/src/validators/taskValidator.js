const ALLOWED_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

function validateTaskId(id) {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0 || String(parsed) !== String(id)) {
    return { valid: false, error: 'Task ID must be a valid positive integer.' };
  }
  return { valid: true, value: parsed };
}

function validateCreateTask(body) {
  const errors = [];
  const { title, description, priority } = body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must not be empty.');
  } else if (title.trim().length > 255) {
    errors.push('Title must be at most 255 characters.');
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }

  if (!priority || typeof priority !== 'string') {
    errors.push('Priority is required and must be LOW, MEDIUM, or HIGH.');
  } else if (!ALLOWED_PRIORITIES.includes(priority.toUpperCase())) {
    errors.push(`Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      title: title ? title.trim() : '',
      description: description ? description.trim() : null,
      priority: priority ? priority.toUpperCase() : 'MEDIUM',
    },
  };
}

function validateUpdateTask(body) {
  const errors = [];
  const { title, description, priority, completed } = body || {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title cannot be empty.');
    } else if (title.trim().length > 255) {
      errors.push('Title must be at most 255 characters.');
    }
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }

  if (priority !== undefined) {
    if (typeof priority !== 'string' || !ALLOWED_PRIORITIES.includes(priority.toUpperCase())) {
      errors.push(`Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
    }
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('Completed must be a boolean (true or false).');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      title: title !== undefined ? title.trim() : undefined,
      description: description !== undefined ? (description ? description.trim() : null) : undefined,
      priority: priority !== undefined ? priority.toUpperCase() : undefined,
      completed: completed !== undefined ? Boolean(completed) : undefined,
    },
  };
}

module.exports = {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
  ALLOWED_PRIORITIES,
};

