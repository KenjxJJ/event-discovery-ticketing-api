const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const Booking = require('../models/booking.model');
const Event = require('../models/event.model');

const router = express.Router();

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

const bookingSchema = Joi.object({
    attendeeName: Joi.string().trim().min(1).required(),
    attendeeEmail: Joi.string().trim().email().required(),
    seats: Joi.number().integer().min(1).required(),
}).unknown(false);

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

function validate(schema, value, res) {
    const result = schema.validate(value, { abortEarly: false, convert: true });
    if (result.error) {
        res.status(400).json({
            message: 'Validation failed',
            errors: result.error.details.map((detail) => detail.message),
        });
        return null;
    }
    return result.value;
}

function validId(id, res) {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid event ID' });
        return false;
    }
    return true;
}

function paginationResponse(page, limit, total) {
    return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

router.post('/', async (req, res) => {
    const input = validate(createEventSchema, req.body, res);
    if (!input) return;

    const event = await Event.create(input);
    res.status(201).json(event);
});

router.get('/', async (req, res) => {
    const query = validate(listQuerySchema, req.query, res);
    if (!query) return;

    const { page, limit, sort, search, city, category, from, to } = query;
    const filter = {};
    if (city) filter.city = new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    if (category) filter.category = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    if (search) filter.$text = { $search: search };
    if (from || to) {
        filter.date = {};
        if (from) filter.date.$gte = from;
        if (to) {
            const endDate = new Date(to);
            if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.to)) endDate.setUTCHours(23, 59, 59, 999);
            filter.date.$lte = endDate;
        }
    }

    const sortField = sort ? sort.replace(/^-/, '') : 'date';
    const sortOrder = sort && sort.startsWith('-') ? -1 : 1;
    const [events, total] = await Promise.all([
        Event.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit),
        Event.countDocuments(filter),
    ]);

    res.json({ data: events, pagination: paginationResponse(page, limit, total) });
});

router.get('/:id/bookings', async (req, res) => {
    if (!validId(req.params.id, res)) return;
    const query = validate(paginationSchema, req.query, res);
    if (!query) return;

    const event = await Event.exists({ _id: req.params.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { page, limit } = query;
    const filter = { event: req.params.id };
    const [bookings, total] = await Promise.all([
        Booking.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        Booking.countDocuments(filter),
    ]);
    res.json({ data: bookings, pagination: paginationResponse(page, limit, total) });
});

router.post('/:id/book', async (req, res) => {
    if (!validId(req.params.id, res)) return;
    const input = validate(bookingSchema, req.body, res);
    if (!input) return;

    const now = new Date();
    const event = await Event.findOneAndUpdate(
        {
            _id: req.params.id,
            status: 'upcoming',
            date: { $gt: now },
            $expr: { $gte: [{ $subtract: ['$capacity', '$seatsBooked'] }, input.seats] },
        },
        { $inc: { seatsBooked: input.seats } },
        { new: true, runValidators: true }
    );

    if (!event) {
        const existingEvent = await Event.findById(req.params.id);
        if (!existingEvent) return res.status(404).json({ message: 'Event not found' });
        if (existingEvent.status === 'cancelled' || existingEvent.date <= now) {
            return res.status(400).json({ message: 'This event cannot be booked' });
        }
        return res.status(409).json({ message: 'Not enough seats remaining' });
    }

    let booking;
    try {
        booking = await Booking.create({ ...input, event: event._id });
    } catch (error) {
        await Event.updateOne({ _id: event._id }, { $inc: { seatsBooked: -input.seats } });
        throw error;
    }

    res.status(201).json({ booking, seatsRemaining: event.seatsRemaining });
});

router.get('/:id', async (req, res) => {
    if (!validId(req.params.id, res)) return;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
});

router.put('/:id', async (req, res) => {
    if (!validId(req.params.id, res)) return;
    const input = validate(updateEventSchema, req.body, res);
    if (!input) return;

    const filter = { _id: req.params.id };
    if (input.capacity !== undefined) {
        filter.$expr = { $lte: ['$seatsBooked', input.capacity] };
    }
    const event = await Event.findOneAndUpdate(filter, input, { new: true, runValidators: true });
    if (!event) {
        const existingEvent = await Event.exists({ _id: req.params.id });
        if (!existingEvent) return res.status(404).json({ message: 'Event not found' });
        return res.status(409).json({ message: 'Capacity cannot be less than seats already booked' });
    }
    res.json(event);
});

router.delete('/:id', async (req, res) => {
    if (!validId(req.params.id, res)) return;
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await Booking.deleteMany({ event: event._id });
    res.json({ message: 'Event deleted' });
});

module.exports = router;