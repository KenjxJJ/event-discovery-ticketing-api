require('dotenv').config();
const express = require('express');
const connectDB = require('./database/connectDb');
const cors = require('cors');
const app = express();
const eventRoutes = require('./routes/event.routes');


const PORT = process.env.PORT || 3000;

app.use(cors('*'));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Event Discovery & Ticketing API is active and running',
        documentation: '/api/events'
    });
});

app.use('/api/events', eventRoutes);

app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Request body contains invalid JSON' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
});

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
