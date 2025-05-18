const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate-image', aiController.generateImage);

module.exports = router; 