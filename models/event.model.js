// Data Model (Event)
// ●​ title (String, required, indexed for search)●​ description (String, optional)
// ●​ category (String, required, e.g., "Tech", "Music", "Business", "Sports", "Arts")
// ●​ city (String, required, indexed)
// ●​ venue (String, required)
// ●​ date (Date, required, must be in the future)
// ●​ price (Number, required, min: 0)
// ●​ capacity (Number, required, min: 1)
// ●​ seatsBooked (Number, default: 0)
// ●​ status (String, "upcoming" or "cancelled", default: "upcoming")
// ●​ seatsRemaining (Virtual field, capacity - seatsBooked, not stored in the database)
// ●​ createdAt / updatedAt (Timestamps)


const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    venue: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Event date must be in the future!'
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    seatsBooked: {
        type: Number,
        default: 0,
        min: 0,
    },
    status: {
        type: String,
        enum: ['upcoming', 'cancelled'],
        default: 'upcoming',
    },
    
}, {timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }})

EventSchema.virtual('seatsRemaining').get(function() {
    return this.capacity - this.seatsBooked;
});

EventSchema.index({ title: 'text', description: 'text' });


module.exports = mongoose.model('Event', EventSchema);