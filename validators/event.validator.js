const Joi = require('joi');

const eventFields = {
    title: Joi.string().trim().min(1),
    description: Joi.string().allow(''),
    category: Joi.string().trim().min(1),
    city: Joi.string().trim().min(1),
    venue: Joi.string().trim().min(1),
    date: Joi.date().greater('now'),
    price: Joi.number().min(0),
    capacity: Joi.number().integer().min(1),
    status: Joi.string().valid('upcoming', 'cancelled'),
};

const createEventSchema = Joi.object({
    ...eventFields,
    title: eventFields.title.required(),
    category: eventFields.category.required(),
    city: eventFields.city.required(),
    venue: eventFields.venue.required(),
    date: eventFields.date.required(),
    price: eventFields.price.required(),
    capacity: eventFields.capacity.required(),
}).unknown(false);

const updateEventSchema = Joi.object(eventFields).min(1).unknown(false);

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
});

const listQuerySchema = paginationSchema.append({
    sort: Joi.string().valid('date', '-date', 'price', '-price', 'title', '-title', 'createdAt', '-createdAt'),
    search: Joi.string().trim().allow(''),
    city: Joi.string().trim().min(1),
    category: Joi.string().trim().min(1),
    from: Joi.date(),
    to: Joi.date(),
}).custom((query, helpers) => {
    if (query.from && query.to && query.from > query.to) {
        return helpers.error('date.range');
    }
    return query;
}).messages({ 'date.range': 'The from date must be on or before the to date' }).unknown(false);

module.exports = {
    eventFields,
    createEventSchema,
    updateEventSchema,
    paginationSchema,
    listQuerySchema,
};
