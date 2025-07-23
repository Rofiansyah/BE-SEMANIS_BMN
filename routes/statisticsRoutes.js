const express = require('express');
const statisticsController = require('../controllers/statisticsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, statisticsController.getStatistics);

module.exports = router;