const Event = require('../models/event.model');
const Booking = require('../models/booking.model');
const { paginationResponse } = require('../utils/pagination.util');

/**
 * Lists paginated bookings for a specific event.
 * GET /api/events/:id/bookings
 */
async function listEventBookings(req, res, next) {
    try {
        const event = await Event.exists({ _id: req.params.id });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const { page, limit } = req.query;
        const filter = { event: req.params.id };

        const [bookings, total] = await Promise.all([
            Booking.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            Booking.countDocuments(filter),
        ]);

        res.json({
            data: bookings,
            pagination: paginationResponse(page, limit, total),
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Reserves seats for an event with strict concurrency control.
 * POST /api/events/:id/book
 */
async function bookEventSeats(req, res, next) {
    try {
        const input = req.body;
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
            if (!existingEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
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

        res.status(201).json({
            booking,
            seatsRemaining: event.seatsRemaining,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listEventBookings,
    bookEventSeats,
};
