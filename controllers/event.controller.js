const Event = require('../models/event.model');
const Booking = require('../models/booking.model');
const { paginationResponse } = require('../utils/pagination.util');

/**
 * Creates a new event record.
 * POST /api/events
 */
async function createEvent(req, res, next) {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
}

/**
 * Lists events matching search filters, sort criteria, and pagination.
 * GET /api/events
 */
async function listEvents(req, res, next) {
    try {
        const { page, limit, sort, search, city, category, from, to } = req.query;
        const filter = {};

        if (city) {
            filter.city = new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        }
        if (category) {
            filter.category = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        }
        if (search) {
            filter.$text = { $search: search };
        }
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = from;
            if (to) {
                const endDate = new Date(to);
                const rawTo = req.rawQuery?.to || req.query.to;
                if (typeof rawTo === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawTo)) {
                    endDate.setUTCHours(23, 59, 59, 999);
                }
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

        res.json({
            data: events,
            pagination: paginationResponse(page, limit, total),
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves a single event by ID.
 * GET /api/events/:id
 */
async function getEventById(req, res, next) {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        next(error);
    }
}

/**
 * Updates an event while verifying capacity invariants.
 * PUT /api/events/:id
 */
async function updateEvent(req, res, next) {
    try {
        const input = req.body;
        const filter = { _id: req.params.id };

        if (input.capacity !== undefined) {
            filter.$expr = { $lte: ['$seatsBooked', input.capacity] };
        }

        const event = await Event.findOneAndUpdate(filter, input, { new: true, runValidators: true });
        if (!event) {
            const existingEvent = await Event.exists({ _id: req.params.id });
            if (!existingEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            return res.status(409).json({ message: 'Capacity cannot be less than seats already booked' });
        }

        res.json(event);
    } catch (error) {
        next(error);
    }
}

/**
 * Deletes an event and cascades deletion to associated bookings.
 * DELETE /api/events/:id
 */
async function deleteEvent(req, res, next) {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await Booking.deleteMany({ event: event._id });
        res.json({ message: 'Event deleted' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createEvent,
    listEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
