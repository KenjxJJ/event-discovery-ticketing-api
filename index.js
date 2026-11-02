require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connectDb');
const eventRoutes = require('./routes/event.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors('*'));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Event Discovery & Ticketing API is active and running',
        documentation: '/api/events',
    });
});

app.use('/api/events', eventRoutes);

app.use(errorHandler);

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

if (require.main === module) {
    startServer();
}

module.exports = app;
