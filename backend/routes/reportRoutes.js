const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authorize = require('../middleware/authMiddleware');  // Import the middleware

// POST route to create a new report (accessible by citizen, officer, admin)
router.post('/reports', authorize(['citizen', 'officer', 'admin']), reportController.createReport);

// GET route to get all reports (accessible by officer, admin)
router.get('/reports', authorize(['citizen', 'officer', 'admin']), reportController.getReports);

// Get report by ID (accessible by officer, admin)
router.get('/reports/:id', authorize(['officer', 'admin']), reportController.getReportById);

// PUT route to update all fields in the report (accessible by officer, admin)
router.put('/reports/:id', authorize(['officer', 'admin']), reportController.updateReport);

// PUT route to update user info (accessible by admin only)
// router.put('/reports/:id/user', authorize(['admin']), reportController.updateUser);

// DELETE route to delete a report (accessible by admin)
router.delete('/reports/:id', authorize(['admin']), reportController.deleteReport);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const reportController = require('../controllers/reportController');
// const { protect, authorize } = require('../middleware/authMiddleware');

// // POST route to create a new report
// router.post('/reports', protect, reportController.createReport);
// // GET route to get all reports
// router.get('/reports', protect, reportController.getReports);

// // Get report by ID
// router.get('/reports/:id', protect, reportController.getReportById);

// // UPDATE user info
// router.put('/reports/:id/user', protect, reportController.updateUser);

// // PUT route to update all fields in the report
// router.put('/reports/:id', protect, reportController.updateReport);

// // DELETE route to delete a report by ID
// router.delete('/reports/:id', protect, authorize(['admin']), reportController.deleteReport);

