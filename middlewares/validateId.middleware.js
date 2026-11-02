const mongoose = require('mongoose');

/**
 * Middleware factory for validating MongoDB ObjectId in request params.
 *
 * @param {string} [paramName='id'] - The request parameter name to validate
 * @returns {import('express').RequestHandler}
 */
function validateObjectId(paramName = 'id') {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        next();
    };
}

module.exports = validateObjectId;
