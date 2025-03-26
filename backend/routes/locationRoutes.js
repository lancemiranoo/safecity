const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch locations' });
    }
});

module.exports = router;
