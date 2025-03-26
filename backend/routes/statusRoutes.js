const express = require('express');
const router = express.Router();
const Status = require('../models/Status');

router.get('/', async (req, res) => {
    try {
        const statuses = await Status.find();
        res.json(statuses);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch statuses' });
    }
});

module.exports = router;
