/**
 * Centralized error-handling middleware for Express.
 * Catches JSON parse errors, unhandled exceptions, and returns consistent error payloads.
 *
 * @param {any} error - Thrown error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
function errorHandler(error, req, res, next) {
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Request body contains invalid JSON' });
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}

module.exports = errorHandler;
