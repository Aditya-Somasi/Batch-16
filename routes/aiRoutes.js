const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// Route to render the AI application page
router.get('/aiapp', ensureAuthenticated, aiController.getAIApp);

// Route to handle AI content generation
router.post('/aiapp', ensureAuthenticated, aiController.generateAIContent);

router.post('/analyze', ensureAuthenticated, aiController.analyze);

module.exports = router;
