require('dotenv').config();
const express = require('express');
const connectDB = require('./database/connectDb');
const cors = require('cors');
const app = express();


const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors('*'));
app.use(express.json());


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
