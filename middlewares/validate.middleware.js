/**
 * Express middleware factory for validating request data against a Joi schema.
 *
 * @param {import('joi').Schema} schema - Joi validation schema
 * @param {'body' | 'query' | 'params'} [source='body'] - Request property to validate
 * @returns {import('express').RequestHandler}
 */
function validate(schema, source = 'body') {
    return (req, res, next) => {
        const result = schema.validate(req[source], { abortEarly: false, convert: true });

        if (result.error) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.details.map((detail) => detail.message),
            });
        }

        if (source === 'query') {
            req.rawQuery = { ...req.query };
            Object.defineProperty(req, 'query', {
                value: result.value,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        } else {
            req[source] = result.value;
        }

        next();
    };
}

module.exports = validate;
