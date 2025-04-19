const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const csrf = require('csurf');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Apply CSRF protection globally for all admin routes
router.use(csrfProtection);

// Admin Dashboard
router.get('/admin', ensureAuthenticated, adminController.adminPage);

// Delete User Route (POST request)
router.post('/admin/delete/:id', ensureAuthenticated, adminController.deleteUser);

module.exports = router;
