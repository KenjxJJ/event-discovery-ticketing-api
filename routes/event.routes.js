const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event.controller');
const bookingController = require('../controllers/booking.controller');
const validate = require('../middlewares/validate.middleware');
const validateObjectId = require('../middlewares/validateId.middleware');

const {
    createEventSchema,
    updateEventSchema,
    listQuerySchema,
} = require('../validators/event.validator');
const {
    bookingSchema,
    paginationSchema,
} = require('../validators/booking.validator');

// Event collection endpoints
router.post('/', validate(createEventSchema, 'body'), eventController.createEvent);
router.get('/', validate(listQuerySchema, 'query'), eventController.listEvents);

// Event booking sub-resource endpoints
router.get('/:id/bookings', validateObjectId('id'), validate(paginationSchema, 'query'), bookingController.listEventBookings);
router.post('/:id/book', validateObjectId('id'), validate(bookingSchema, 'body'), bookingController.bookEventSeats);

// Single event item endpoints
router.get('/:id', validateObjectId('id'), eventController.getEventById);
router.put('/:id', validateObjectId('id'), validate(updateEventSchema, 'body'), eventController.updateEvent);
router.delete('/:id', validateObjectId('id'), eventController.deleteEvent);

module.exports = router;