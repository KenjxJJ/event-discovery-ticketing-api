const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    attendeeName: {
        type: String,
        required: true,
    },
    attendeeEmail: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    seats: {
        type: Number,
        required: true,
        min: 1,
    },
}, {timestamps: true})

module.exports = mongoose.model('Booking', BookingSchema);