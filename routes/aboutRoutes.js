const express = require('express');
const router = express.Router();

// GET /about
router.get('/about', (req, res) => {
  res.render('about', {
    user: req.user // or req.session.user if you're using sessions
  });
});

module.exports = router;
