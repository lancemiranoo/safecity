const Report = require('../models/Report');
// Generate Report
exports.createReport = async (req, res) => {
    try {
        const { user, location, category, status, description } = req.body;
        const newReport = new Report({
            user,
            location,
            category,
            status,
            description,
        });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to get all reports
// Function to get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('user')
            .populate('location')
            .populate('category')
            .populate('status'); // Populate all the references

        res.status(200).json(reports);  // Send the reports in the response
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('user')
            .populate('location')
            .populate('category')
            .populate('status'); // Populate all the references

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(report);  // Return the populated report
    } catch (err) {
        res.status(500).json({ message: 'Invalid ID format or server error' });
    }
};


// Update all fields of a report
exports.updateReport = async (req, res) => {
    try {
        // Destructure all fields from the request body
        const { user, location, category, status, description } = req.body;

        console.log('Received ID:', req.params.id);  // Log the report ID
        console.log('Request Body:', req.body);  // Log the entire body to check the contents

        // Find the report by ID and update the fields
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { user, location, category, status, description },
            { new: true, runValidators: true } // Return updated document and apply validation
        );

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(report);  // Return updated report
    } catch (err) {
        console.error("Error updating report:", err);
        res.status(500).json({ message: "Invalid ID format or server error" });
    }
};

// Update the user field of a report
exports.updateUser = async (req, res) => {
    try {
        const { user } = req.body;

        console.log('Received ID:', req.params.id); // Debugging
        console.log('Request Body:', req.body);  // Debug
        console.log('New User:', user); // Debugging

        // Find report by ID and update user field
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { user },
            { new: true, runValidators: true } // Return updated document and apply validation
        );

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ message: 'Invalid ID format or server error' });
    }
};

// Function to delete a report by ID
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);  // Delete the report by ID
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });  // If no report was found, return a 404
        }
        res.status(200).json({ message: 'Report deleted successfully' });  // Return success message
    } catch (err) {
        res.status(500).json({ message: err.message });  // Handle any errors
    }
};