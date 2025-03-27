const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const locationRoutes = require('./routes/locationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const statusRoutes = require('./routes/statusRoutes');
const userRoutes = require('./routes/userRoutes');


// const dotenv = require('dotenv');
// dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());

app.use(cors());

app.use('/api', authRoutes);
app.use('/api', reportRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
