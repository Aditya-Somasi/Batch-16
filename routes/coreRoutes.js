const express = require('express');
const router = express.Router();
const coreController = require('../controllers/coreController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// Route to render the homepage for authenticated users
router.get('/', ensureAuthenticated, coreController.getIndex);
router.get('/dashboard', (req, res) => {
  const user = req.session.user;
  const error = req.query.error || null; // Get the error from the URL query if it exists
  res.render('dashboard', { error, user });
});
router.get('/trends', (req, res) => {
  const error = req.query.error || null; // Get the error from the URL query if it exists
  res.render('trends', { error });
});
router.get('/sentiment', (req, res) => {
  const error = req.query.error || null; // Get the error from the URL query if it exists
  res.render('sentiment', { error });
});
router.get('/content', (req, res) => {
  const error = req.query.error || null; // Get the error from the URL query if it exists
  res.render('content', { error });
});

router.get('/graphs', (req, res) => {
  const user = req.session.user;
  const error = req.query.error || null; // Get the error from the URL query if it exists
  res.render('graphs', { error, user });
});

module.exports = router;
