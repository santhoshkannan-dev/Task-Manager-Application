const { validateTaskId } = require('../validators/taskValidator');

function validateIdParam(req, res, next) {
  const result = validateTaskId(req.params.id);
  if (!result.valid) {
    return res.status(400).json({
      success: false,
      error: result.error,
    });
  }
  req.validatedId = result.value;
  next();
}

module.exports = {
  validateIdParam,
};
