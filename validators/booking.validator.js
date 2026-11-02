const Joi = require('joi');

const bookingSchema = Joi.object({
    attendeeName: Joi.string().trim().min(1).required(),
    attendeeEmail: Joi.string().trim().email().required(),
    seats: Joi.number().integer().min(1).required(),
}).unknown(false);

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
    bookingSchema,
    paginationSchema,
};
